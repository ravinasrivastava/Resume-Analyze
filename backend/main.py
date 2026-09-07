from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from datetime import datetime, timezone
import io, json, re, sqlite3

app = FastAPI(title='CareerMatch AI API', version='1.0.0', description='Private, explainable resume-to-role matching without paid AI APIs.')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:3000'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
DB = Path(__file__).parent / 'careermatch.db'
SKILLS = {'languages':['python','javascript','typescript','java','go','rust','c++','sql'], 'frameworks':['react','next.js','nextjs','vue','angular','node.js','node','django','fastapi','flask','tailwind css'], 'databases':['postgresql','postgres','mysql','mongodb','redis','sqlite'], 'tools':['aws','docker','kubernetes','git','github','rest apis','graphql','ci/cd','testing','figma'], 'soft':['communication','leadership','ownership','problem-solving','agile','collaboration']}
ALL_SKILLS = {s.replace('nextjs','next.js').replace('node','node.js') for group in SKILLS.values() for s in group}
class AnalyzeResponse(BaseModel): score:int=Field(ge=0,le=100); matched:list[str]; missing:list[str]; extra:list[str]; recommendations:list[str]; jobTitle:str; resumeName:str; keywordScore:int; semanticScore:int; id:int|None=None

def init_db():
 with sqlite3.connect(DB) as conn: conn.execute('CREATE TABLE IF NOT EXISTS analyses (id INTEGER PRIMARY KEY, created_at TEXT, job_title TEXT, score INTEGER, matched TEXT, missing TEXT, resume_name TEXT)')
init_db()
def normalize(text:str)->str: return re.sub(r'[^a-z0-9+#.\-/ ]',' ',text.lower())
def extract_skills(text:str)->set[str]:
 t=normalize(text); return {skill for skill in ALL_SKILLS if re.search(r'(?<![a-z0-9])'+re.escape(skill)+r'(?![a-z0-9])',t)}
def title_from_jd(text:str)->str:
 for line in text.splitlines():
  if re.search(r'(engineer|developer|designer|manager|analyst)',line,re.I) and len(line)<100:return line.strip(' #-')
 return 'Role match analysis'
def similarity(a:str,b:str)->int:
 a_words=set(re.findall(r'[a-z][a-z0-9+#.-]{2,}',normalize(a))); b_words=set(re.findall(r'[a-z][a-z0-9+#.-]{2,}',normalize(b)))
 return round(100*len(a_words&b_words)/max(1,len(b_words)))
def build_analysis(resume:str,jd:str,name:str)->AnalyzeResponse:
 req=extract_skills(jd); found=extract_skills(resume); matched=sorted(req&found); missing=sorted(req-found); extra=sorted(found-req); key=round(100*len(matched)/max(1,len(req))); sem=similarity(resume,jd); score=round(key*.62+sem*.38)
 rec=[f'Add a concrete project outcome that demonstrates {missing[0]}.' if missing else 'Lead with your strongest role-relevant project outcome.', 'Surface supported keywords in your summary and recent experience bullets.', 'Keep recommendations evidence-based: only add technologies you have genuinely used.']
 return AnalyzeResponse(score=score,matched=matched,missing=missing,extra=extra,recommendations=rec,jobTitle=title_from_jd(jd),resumeName=name or 'resume.pdf',keywordScore=key,semanticScore=sem)
def save(result:AnalyzeResponse)->int:
 with sqlite3.connect(DB) as conn:
  cur=conn.execute('INSERT INTO analyses(created_at,job_title,score,matched,missing,resume_name) VALUES(?,?,?,?,?,?)',(datetime.now(timezone.utc).isoformat(),result.jobTitle,result.score,json.dumps(result.matched),json.dumps(result.missing),result.resumeName)); return cur.lastrowid
async def pdf_text(data:bytes)->str:
 try:
  import pypdf
  return '\n'.join((p.extract_text() or '') for p in pypdf.PdfReader(io.BytesIO(data)).pages)
 except Exception as exc: raise HTTPException(400,'Could not extract text from this PDF.') from exc
@app.get('/health')
def health(): return {'status':'ok'}
@app.post('/resume/upload')
async def upload(resume:UploadFile=File(...)):
 if resume.content_type!='application/pdf': raise HTTPException(415,'Only PDF resumes are supported.')
 data=await resume.read()
 if len(data)>5*1024*1024: raise HTTPException(413,'Resume must be smaller than 5MB.')
 text=await pdf_text(data); return {'filename':resume.filename,'characters':len(text),'preview':text[:500]}
@app.post('/analyze',response_model=AnalyzeResponse)
async def analyze(job_description:str=Form(...,min_length=20,max_length=40000), resume:UploadFile|None=File(None), resume_text:str=Form('')):
 if not resume and not resume_text: raise HTTPException(422,'Provide a PDF resume or resume text.')
 text=resume_text; name='resume.pdf'
 if resume:
  if resume.content_type!='application/pdf': raise HTTPException(415,'Only PDF resumes are supported.')
  data=await resume.read()
  if len(data)>5*1024*1024: raise HTTPException(413,'Resume must be smaller than 5MB.')
  text=await pdf_text(data); name=resume.filename or name
 result=build_analysis(text,job_description,name); result.id=save(result); return result
@app.get('/analysis-history')
def history():
 with sqlite3.connect(DB) as conn:
  rows=conn.execute('SELECT id,created_at,job_title,score,matched,missing,resume_name FROM analyses ORDER BY id DESC LIMIT 20').fetchall()
 return [{'id':r[0],'createdAt':r[1],'jobTitle':r[2],'score':r[3],'matched':json.loads(r[4]),'missing':json.loads(r[5]),'resumeName':r[6]} for r in rows]
@app.get('/analysis/{analysis_id}')
def get_analysis(analysis_id:int):
 with sqlite3.connect(DB) as conn: row=conn.execute('SELECT id,job_title,score,matched,missing,resume_name FROM analyses WHERE id=?',(analysis_id,)).fetchone()
 if not row: raise HTTPException(404,'Analysis not found.')
 return {'id':row[0],'jobTitle':row[1],'score':row[2],'matched':json.loads(row[3]),'missing':json.loads(row[4]),'resumeName':row[5]}

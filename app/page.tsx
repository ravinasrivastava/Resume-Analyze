// 'use client'

// import { useMemo, useRef, useState } from 'react'
// import { AlertCircle, ArrowUpRight, BarChart3, Check, ChevronRight, CircleHelp, Clock3, FileText, Gauge, History, Layers3, Lightbulb, Loader2, LockKeyhole, Menu, RotateCcw, Search, ShieldCheck, Sparkles, Target, UploadCloud, X } from 'lucide-react'

// type Analysis = { score:number; matched:string[]; missing:string[]; extra:string[]; recommendations:string[]; jobTitle:string; resumeName:string; keywordScore:number; semanticScore:number }
// const sampleJD = `We are looking for a Product-minded Full Stack Engineer to join our platform team. You will build reliable, accessible web products using TypeScript, React, Next.js, Node.js, PostgreSQL, and AWS. Experience with REST APIs, Git, testing, CI/CD, and collaborative Agile teams is expected. Strong communication, ownership, and problem-solving skills are important.`
// const demo: Analysis = { score:78, matched:['TypeScript','React','Next.js','Node.js','PostgreSQL','REST APIs','Git','Testing','Agile'], missing:['AWS','CI/CD','Docker'], extra:['Tailwind CSS','Figma','GraphQL'], recommendations:['Add a measurable project bullet that demonstrates production React or Next.js ownership.','Surface your experience with testing and REST APIs in the top third of your resume.','If you have used AWS or CI/CD, name the specific services and outcomes rather than adding broad keywords.'], jobTitle:'Full Stack Engineer', resumeName:'alex-johnson-resume.pdf', keywordScore:82, semanticScore:74 }

// function ScoreRing({ score }:{score:number}) { const angle = score * 3.6; return <div className="score-ring" style={{'--score-angle':`${angle}deg`} as React.CSSProperties}><div className="score-inner"><strong>{score}</strong><span>/ 100</span></div></div> }
// function Chip({ children, tone='neutral', onRemove }:{children:React.ReactNode;tone?:'good'|'warn'|'neutral';onRemove?:()=>void}) { return <span className={`chip chip-${tone}`}>{children}{onRemove&&<button aria-label={`Remove ${children}`} onClick={onRemove}><X size={12}/></button>}</span> }
// function Stat({icon:Icon,label,value,detail}:{icon:typeof Target;label:string;value:string;detail:string}) { return <div className="stat"><div className="stat-icon"><Icon size={17}/></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div> }

// export default function Page(){
//  const [resume,setResume]=useState<File|null>(null); const [jd,setJd]=useState(''); const [result,setResult]=useState<Analysis|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const inputRef=useRef<HTMLInputElement>(null)
//  const hasInputs=Boolean(resume || jd.trim());
//  const visible=result || demo
//  const title=useMemo(()=>result?.jobTitle || 'Product Engineer', [result])
//  const handleFile=(file?:File)=>{ if(!file)return; if(file.type!=='application/pdf'){setError('Please upload a PDF resume.');return} if(file.size>5*1024*1024){setError('Resume must be smaller than 5MB.');return} setError(''); setResume(file) }
//  const analyze=async()=>{ setError(''); setLoading(true); try { if(!resume && !jd.trim()) throw new Error('Upload a resume or paste a job description to begin.'); const body=new FormData(); if(resume)body.append('resume',resume); body.append('job_description',jd || sampleJD); const response=await fetch('/api/analyze',{method:'POST',body}); if(!response.ok)throw new Error('service'); const data=await response.json(); setResult({...demo,...data}) } catch { setResult({...demo,resumeName:resume?.name || demo.resumeName}); } finally { setTimeout(()=>setLoading(false),650) } }
//  const reset=()=>{setResume(null);setJd('');setResult(null);setError('')}
//  return <main className="app-shell">
//   <aside className="rail"><div className="brand-mark"><Sparkles size={18}/></div><nav aria-label="Primary navigation"><button className="rail-link active" aria-label="Analyze"><Gauge size={20}/><span>Analyze</span></button><button className="rail-link" aria-label="History"><History size={20}/><span>History</span></button><button className="rail-link" aria-label="Saved insights"><Layers3 size={20}/><span>Insights</span></button></nav><div className="rail-bottom"><button className="rail-link" aria-label="Help"><CircleHelp size={20}/></button><div className="avatar">AJ</div></div></aside>
//   <section className="workspace"><header className="topbar"><div className="mobile-brand"><div className="brand-mark"><Sparkles size={17}/></div><span>CareerMatch <b>AI</b></span></div><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>New analysis</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18}/></button><span className="plan-pill"><ShieldCheck size={13}/> Private workspace</span><button className="mobile-menu" aria-label="Open menu"><Menu size={20}/></button></div></header>
//    <div className="content"><div className="intro"><div><p className="eyebrow"><span className="status-dot"/> Resume intelligence</p><h1>Find your <em>career edge.</em></h1><p className="lede">See how your experience aligns with the role, what to emphasize, and where your next opportunity to grow is.</p></div><button className="text-button" onClick={reset}><RotateCcw size={15}/> New analysis</button></div>
//     <div className="analysis-grid"><section className="inputs-column"><div className="section-heading"><div><span className="step-label">01 / INPUTS</span><h2>Bring your context</h2></div><span className="secure-note"><LockKeyhole size={13}/> Your data stays private</span></div>
//       <div className={`dropzone ${resume?'has-file':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0])}} onClick={()=>inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&inputRef.current?.click()}><input ref={inputRef} type="file" accept="application/pdf" hidden onChange={e=>handleFile(e.target.files?.[0])}/>{resume?<><div className="file-icon"><FileText size={21}/></div><div className="upload-copy"><strong>{resume.name}</strong><span>{(resume.size/1024/1024).toFixed(2)} MB · Ready to analyze</span></div><button className="remove-file" aria-label="Remove resume" onClick={e=>{e.stopPropagation();setResume(null)}}><X size={16}/></button></>:<><div className="upload-icon"><UploadCloud size={22}/></div><div className="upload-copy"><strong>Drop your resume here</strong><span>PDF only · up to 5MB</span></div><button className="browse-button" type="button">Browse file</button></>}</div>
//       <div className="field-label"><label htmlFor="job-description">Job description</label><span>{jd.length}/4,000</span></div><textarea id="job-description" value={jd} maxLength={4000} onChange={e=>setJd(e.target.value)} placeholder="Paste the job description you’re applying for..."/><div className="field-footer"><button className="sample-link" onClick={()=>setJd(sampleJD)}><Sparkles size={14}/> Use a sample role</button><span>We’ll identify the role automatically</span></div>{error&&<div className="error-message"><AlertCircle size={15}/>{error}</div>}
//       <button className="analyze-button" onClick={analyze} disabled={loading}>{loading?<><Loader2 size={17} className="spin"/> Reading your profile...</>:<><Target size={17}/> Analyze match <ArrowUpRight size={17}/></>}</button><p className="disclaimer">By analyzing, you agree to CareerMatch AI’s <u>terms</u>. No data is used to train models.</p>
//     </section>
//     <section className="results-column"><div className="section-heading result-heading"><div><span className="step-label">02 / YOUR READOUT</span><h2>{result?'Your match report':'Your potential match'}</h2></div>{result&&<span className="result-time"><Clock3 size={13}/> Just now</span>}</div><div className="score-card"><div className="score-top"><div><span className="role-kicker">MATCH FOR</span><h3>{title}</h3><p>{visible.resumeName} <span>•</span> {result?'Analyzed today':'Sample result'}</p></div><ScoreRing score={visible.score}/></div><div className="score-bar"><span style={{width:`${visible.score}%`}}/></div><div className="score-caption"><span><b>Strong match</b> — you’re in the conversation.</span><button>How is this calculated? <ChevronRight size={13}/></button></div></div>
//       <div className="stats-grid"><Stat icon={Check} label="Skills matched" value={`${visible.matched.length}`} detail={`of ${visible.matched.length+visible.missing.length} required`}/><Stat icon={Target} label="Keyword alignment" value={`${visible.keywordScore}%`} detail="Role language overlap"/><Stat icon={BarChart3} label="Experience fit" value={`${visible.semanticScore}%`} detail="Contextual similarity"/></div>
//       <div className="skill-section"><div className="section-mini-heading"><div><span className="role-kicker">SKILL SIGNALS</span><h3>What stands out</h3></div><span className="signal-legend"><i className="legend-good"/>Matched <i className="legend-warn"/>Missing</span></div><div className="chips-wrap">{visible.matched.map(s=><Chip key={s} tone="good">{s}</Chip>)}{visible.missing.map(s=><Chip key={s} tone="warn">{s}</Chip>)}</div></div>
//       <div className="recommendations"><div className="section-mini-heading"><div><span className="role-kicker">NEXT MOVES</span><h3>Recommendations</h3></div><Lightbulb size={18} className="bulb"/></div>{visible.recommendations.map((r,i)=><div className="recommendation" key={r}><span>0{i+1}</span><p>{r}</p></div>)}</div>
//     </section></div>
//     <div className="history-strip"><div className="history-title"><History size={18}/><div><strong>Recent analyses</strong><span>Your last three role comparisons</span></div></div><div className="history-items"><div><span>Senior Frontend Engineer</span><b>84%</b><small>2 days ago</small></div><div><span>Product Designer</span><b>71%</b><small>May 18, 2024</small></div><button>View history <ArrowUpRight size={14}/></button></div></div>
//    </div><footer className="footer"><span>CareerMatch <b>AI</b> · Built for better applications</span><span>v1.0 · <a href="#privacy">Privacy first</a></span></footer>
//   </section>
//  </main>
// }



'use client'

import { useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Gauge,
  History,
  Layers3,
  Lightbulb,
  Loader2,
  LockKeyhole,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  X
} from 'lucide-react'

type Analysis = {
  score: number
  matched: string[]
  missing: string[]
  extra: string[]
  recommendations: string[]
  jobTitle: string
  resumeName: string
  keywordScore: number
  semanticScore: number
}

const sampleJD = `We are looking for a Product-minded Full Stack Engineer to join our platform team. You will build reliable, accessible web products using TypeScript, React, Next.js, Node.js, PostgreSQL, and AWS. Experience with REST APIs, Git, testing, CI/CD, and collaborative Agile teams is expected. Strong communication, ownership, and problem-solving skills are important.`

const demo: Analysis = {
  score: 78,
  matched: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'REST APIs',
    'Git',
    'Testing',
    'Agile'
  ],
  missing: ['AWS', 'CI/CD', 'Docker'],
  extra: ['Tailwind CSS', 'Figma', 'GraphQL'],
  recommendations: [
    'Add a measurable project bullet that demonstrates production React or Next.js ownership.',
    'Surface your experience with testing and REST APIs in the top third of your resume.',
    'If you have used AWS or CI/CD, name the specific services and outcomes rather than adding broad keywords.'
  ],
  jobTitle: 'Full Stack Engineer',
  resumeName: 'alex-johnson-resume.pdf',
  keywordScore: 82,
  semanticScore: 74
}

function ScoreRing({ score }: { score: number }) {
  const angle = score * 3.6

  return (
    <div
      className="score-ring"
      style={
        {
          '--score-angle': `${angle}deg`
        } as React.CSSProperties
      }
    >
      <div className="score-inner">
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
    </div>
  )
}

function Chip({
  children,
  tone = 'neutral',
  onRemove
}: {
  children: React.ReactNode
  tone?: 'good' | 'warn' | 'neutral'
  onRemove?: () => void
}) {
  return (
    <span className={`chip chip-${tone}`}>
      {children}
      {onRemove && (
        <button
          aria-label={`Remove ${children}`}
          onClick={onRemove}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: typeof Target
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="stat">
      <div className="stat-icon">
        <Icon size={17} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  )
}

export default function Page() {
  const [resume, setResume] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const visible = result || demo

  const title = useMemo(
    () => result?.jobTitle || 'Product Engineer',
    [result]
  )

  const handleFile = (file?: File) => {
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF resume.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume must be smaller than 5MB.')
      return
    }

    setError('')
    setResume(file)
  }

  // const analyze = async () => {
  //   setError('')
  //   setLoading(true)

  //   try {
  //     if (!resume) {
  //       throw new Error('Please upload your PDF resume first.')
  //     }

  //     if (!jd.trim()) {
  //       throw new Error('Please paste the job description first.')
  //     }

  //     const body = new FormData()

  //     body.append('resume', resume)
  //     body.append('job_description', jd.trim())

  //     const response = await fetch(
  //       'http://127.0.0.1:8000/analyze',
  //       {
  //         method: 'POST',
  //         body
  //       }
  //     )

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => null)

  //       throw new Error(
  //         errorData?.detail ||
  //           `Analysis failed. Server returned ${response.status}.`
  //       )
  //     }

  //     const data = await response.json()

  //     setResult({
  //       ...demo,
  //       ...data
  //     })
  //   } catch (err) {
  //     console.error('Analyze error:', err)

  //     setResult(null)

  //     setError(
  //       err instanceof Error
  //         ? err.message
  //         : 'Something went wrong while analyzing the resume.'
  //     )
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const analyze = async () => {
  setError('')
  setLoading(true)

  try {
    if (!resume) {
      throw new Error('Please upload your PDF resume first.')
    }

    if (!jd.trim()) {
      throw new Error('Please paste the job description first.')
    }

    const body = new FormData()

    body.append('resume', resume)
    body.append('job_description', jd.trim())

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)

      throw new Error(
        errorData?.detail ||
          `Analysis failed. Server returned ${response.status}.`
      )
    }

    const data = await response.json()

    setResult({
      ...demo,
      ...data
    })
  } catch (err) {
    console.error('Analyze error:', err)

    setResult(null)

    setError(
      err instanceof Error
        ? err.message
        : 'Something went wrong while analyzing the resume.'
    )
  } finally {
    setLoading(false)
  }
}

  const reset = () => {
    setResume(null)
    setJd('')
    setResult(null)
    setError('')
  }

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark">
          <Sparkles size={18} />
        </div>

        <nav aria-label="Primary navigation">
          <button className="rail-link active" aria-label="Analyze">
            <Gauge size={20} />
            <span>Analyze</span>
          </button>

          <button className="rail-link" aria-label="History">
            <History size={20} />
            <span>History</span>
          </button>

          <button className="rail-link" aria-label="Saved insights">
            <Layers3 size={20} />
            <span>Insights</span>
          </button>
        </nav>

        <div className="rail-bottom">
          <button className="rail-link" aria-label="Help">
            <CircleHelp size={20} />
          </button>

          <div className="avatar">AJ</div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark">
              <Sparkles size={17} />
            </div>

            <span>
              CareerMatch <b>AI</b>
            </span>
          </div>

          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>New analysis</strong>
          </div>

          <div className="top-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={18} />
            </button>

            <span className="plan-pill">
              <ShieldCheck size={13} />
              Private workspace
            </span>

            <button className="mobile-menu" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="content">
          <div className="intro">
            <div>
              <p className="eyebrow">
                <span className="status-dot" />
                Resume intelligence
              </p>

              <h1>
                Find your <em>career edge.</em>
              </h1>

              <p className="lede">
                See how your experience aligns with the role, what to
                emphasize, and where your next opportunity to grow is.
              </p>
            </div>

            <button className="text-button" onClick={reset}>
              <RotateCcw size={15} />
              New analysis
            </button>
          </div>

          <div className="analysis-grid">
            <section className="inputs-column">
              <div className="section-heading">
                <div>
                  <span className="step-label">01 / INPUTS</span>
                  <h2>Bring your context</h2>
                </div>

                <span className="secure-note">
                  <LockKeyhole size={13} />
                  Your data stays private
                </span>
              </div>

              <div
                className={`dropzone ${resume ? 'has-file' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFile(e.dataTransfer.files[0])
                }}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    inputRef.current?.click()
                  }
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) =>
                    handleFile(e.target.files?.[0])
                  }
                />

                {resume ? (
                  <>
                    <div className="file-icon">
                      <FileText size={21} />
                    </div>

                    <div className="upload-copy">
                      <strong>{resume.name}</strong>

                      <span>
                        {(resume.size / 1024 / 1024).toFixed(2)} MB ·
                        Ready to analyze
                      </span>
                    </div>

                    <button
                      className="remove-file"
                      aria-label="Remove resume"
                      onClick={(e) => {
                        e.stopPropagation()
                        setResume(null)
                      }}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">
                      <UploadCloud size={22} />
                    </div>

                    <div className="upload-copy">
                      <strong>Drop your resume here</strong>
                      <span>PDF only · up to 5MB</span>
                    </div>

                    <button
                      className="browse-button"
                      type="button"
                    >
                      Browse file
                    </button>
                  </>
                )}
              </div>

              <div className="field-label">
                <label htmlFor="job-description">
                  Job description
                </label>

                <span>{jd.length}/4,000</span>
              </div>

              <textarea
                id="job-description"
                value={jd}
                maxLength={4000}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description you’re applying for..."
              />

              <div className="field-footer">
                <button
                  className="sample-link"
                  onClick={() => setJd(sampleJD)}
                >
                  <Sparkles size={14} />
                  Use a sample role
                </button>

                <span>
                  We’ll identify the role automatically
                </span>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <button
                className="analyze-button"
                onClick={analyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="spin" />
                    Reading your profile...
                  </>
                ) : (
                  <>
                    <Target size={17} />
                    Analyze match
                    <ArrowUpRight size={17} />
                  </>
                )}
              </button>

              <p className="disclaimer">
                By analyzing, you agree to CareerMatch AI’s{' '}
                <u>terms</u>. No data is used to train models.
              </p>
            </section>

            <section className="results-column">
              <div className="section-heading result-heading">
                <div>
                  <span className="step-label">
                    02 / YOUR READOUT
                  </span>

                  <h2>
                    {result
                      ? 'Your match report'
                      : 'Your potential match'}
                  </h2>
                </div>

                {result && (
                  <span className="result-time">
                    <Clock3 size={13} />
                    Just now
                  </span>
                )}
              </div>

              <div className="score-card">
                <div className="score-top">
                  <div>
                    <span className="role-kicker">
                      MATCH FOR
                    </span>

                    <h3>{title}</h3>

                    <p>
                      {visible.resumeName}
                      <span> • </span>
                      {result ? 'Analyzed today' : 'Sample result'}
                    </p>
                  </div>

                  <ScoreRing score={visible.score} />
                </div>

                <div className="score-bar">
                  <span
                    style={{
                      width: `${visible.score}%`
                    }}
                  />
                </div>

                <div className="score-caption">
                  <span>
                    <b>Strong match</b> — you’re in the
                    conversation.
                  </span>

                  <button>
                    How is this calculated?
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              <div className="stats-grid">
                <Stat
                  icon={Check}
                  label="Skills matched"
                  value={`${visible.matched.length}`}
                  detail={`of ${
                    visible.matched.length +
                    visible.missing.length
                  } required`}
                />

                <Stat
                  icon={Target}
                  label="Keyword alignment"
                  value={`${visible.keywordScore}%`}
                  detail="Role language overlap"
                />

                <Stat
                  icon={BarChart3}
                  label="Experience fit"
                  value={`${visible.semanticScore}%`}
                  detail="Contextual similarity"
                />
              </div>

              <div className="skill-section">
                <div className="section-mini-heading">
                  <div>
                    <span className="role-kicker">
                      SKILL SIGNALS
                    </span>

                    <h3>What stands out</h3>
                  </div>

                  <span className="signal-legend">
                    <i className="legend-good" />
                    Matched
                    <i className="legend-warn" />
                    Missing
                  </span>
                </div>

                <div className="chips-wrap">
                  {visible.matched.map((s) => (
                    <Chip key={s} tone="good">
                      {s}
                    </Chip>
                  ))}

                  {visible.missing.map((s) => (
                    <Chip key={s} tone="warn">
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="recommendations">
                <div className="section-mini-heading">
                  <div>
                    <span className="role-kicker">
                      NEXT MOVES
                    </span>

                    <h3>Recommendations</h3>
                  </div>

                  <Lightbulb
                    size={18}
                    className="bulb"
                  />
                </div>

                {visible.recommendations.map((r, i) => (
                  <div
                    className="recommendation"
                    key={r}
                  >
                    <span>0{i + 1}</span>
                    <p>{r}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="history-strip">
            <div className="history-title">
              <History size={18} />

              <div>
                <strong>Recent analyses</strong>
                <span>
                  Your last three role comparisons
                </span>
              </div>
            </div>

            <div className="history-items">
              <div>
                <span>Senior Frontend Engineer</span>
                <b>84%</b>
                <small>2 days ago</small>
              </div>

              <div>
                <span>Product Designer</span>
                <b>71%</b>
                <small>May 18, 2024</small>
              </div>

              <button>
                View history
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* <footer className="footer">
          <span>
            CareerMatch <b>AI</b> · Built for better applications
          </span>

          <span>
            v1.0 · <a href="#privacy">Privacy first</a>
          </span>
        </footer> */}
      </section>
    </main>
  )
}
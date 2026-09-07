from main import build_analysis, extract_skills, normalize

def test_normalize_and_extract():
 text = 'Built TypeScript React apps with PostgreSQL and AWS.'
 assert 'typescript' in extract_skills(text)
 assert normalize('React!') == 'react '

def test_score_favors_required_skills():
 result = build_analysis('TypeScript React PostgreSQL Git', 'Frontend Engineer: TypeScript React PostgreSQL AWS', 'resume.pdf')
 assert result.score > 40
 assert 'aws' in result.missing
 assert 'react' in result.matched

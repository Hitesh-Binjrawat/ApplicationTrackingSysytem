import requests
from dotenv import load_dotenv
import os
from ats_scorer.pdf_reader import  extract_resume_text
from openai import OpenAI
import json
from google import genai

# DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_KEY")
  # Example endpoint
key=os.getenv("GOOGLE_API_KEY")
# key="AIzaSyDiWeJ91ussCLR6mV7THyWAodMUFkXvUXY" # I had disabled this key so no need to
# print(key)
client= genai.Client(api_key=key)

def get_ats_score(jd_text, resume_text):
    """
    Evaluate resume against job description and return ATS score
    """
    
    prompt = f"""
You are a senior technical recruiter, ATS evaluator, and resume screening expert.

Your task is to evaluate the candidate's resume against the provided job description.

You must:
- Analyze ATS compatibility
- Compare resume keywords with job requirements
- Evaluate technical relevance
- Assess recruiter appeal
- Generate actionable and highly specific feedback

IMPORTANT RULES:
1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not include explanations outside JSON.
4. Do not hallucinate experience or skills not present in the resume.
5. Base feedback strictly on the provided resume and job description.
6. Keep feedback concise but detailed.
7. Use professional recruiter-style language.

SCORING GUIDELINES:
- 90-100 = Excellent match
- 75-89 = Strong match
- 60-74 = Moderate match
- Below 60 = Weak match

Evaluation Areas:
1. Skills Match
2. Experience Relevance
3. Project Relevance
4. ATS Keyword Match
5. Resume Formatting
6. Education Alignment
7. Technical Depth
8. Quantified Achievements

Resume:
----------------
{resume_text}
----------------

Job Description:
----------------
{jd_text}
----------------

Return STRICT JSON in this exact structure:

{{
  "ats_score": 0,

  "match_level": "Excellent Match | Strong Match | Moderate Match | Weak Match",

  "summary": "Provide a concise 3-5 sentence evaluation summarizing overall fit, ATS compatibility, technical alignment, and recruiter impression.",

  "strengths": [
    "Specific strength",
    "Specific strength"
  ],

  "weaknesses": [
    "Specific weakness",
    "Specific weakness"
  ],

  "missing_keywords": [
    "keyword1",
    "keyword2"
  ],

  "keyword_match_analysis": {{
    "matched_keywords": [
      "Python",
      "SQL"
    ],
    "missing_important_keywords": [
      "Docker",
      "Kubernetes"
    ]
  }},

  "section_feedback": {{
    "skills": {{
      "score": 0,
      "feedback": "Detailed evaluation of technical skills relevance."
    }},

    "experience": {{
      "score": 0,
      "feedback": "Evaluation of work experience relevance."
    }},

    "projects": {{
      "score": 0,
      "feedback": "Evaluation of project quality and relevance."
    }},

    "education": {{
      "score": 0,
      "feedback": "Evaluation of educational alignment."
    }},

    "formatting": {{
      "score": 0,
      "feedback": "Evaluation of ATS readability and formatting."
    }}
  }},

  "improvement_suggestions": [
    {{
      "issue": "Missing cloud technologies",
      "suggestion": "Add cloud deployment or cloud-related projects.",
      "example": "Built and deployed a Flask ML API on AWS EC2 using Docker."
    }},
    {{
      "issue": "Weak project descriptions",
      "suggestion": "Add quantified business impact.",
      "example": "Improved prediction accuracy by 18% using XGBoost."
    }}
  ],

  "ats_risks": [
    "Missing core JD keywords",
    "Insufficient quantified achievements"
  ],

  "recruiter_notes": [
    "Projects are technically strong but lack measurable impact.",
    "Resume demonstrates good ML foundations."
  ],

  "final_recommendation": {{
    "status": "Proceed | Consider | Reject",
    "reason": "Short recruiter-style hiring recommendation."
  }}
}}
"""

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=prompt,
)
    return response.text
def atsscore_pipeline(pdf_path,jd_text):
    resume_text=extract_resume_text(pdf_path)
    ats_result=get_ats_score(jd_text=jd_text,resume_text=resume_text)

    return ats_result




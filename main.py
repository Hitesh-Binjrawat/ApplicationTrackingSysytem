from ats_scorer.ats import atsscore_pipeline
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI,UploadFile, File, Form
import os
import shutil

app=FastAPI()

# allow React Frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR,exist_ok=True)

@app.get("/")
def read_root():
    return{"Hello":"World"}
# print(atsscore_pipeline(
# pdf_path=pdf_path,
# jd_text=jd_text
# ))
@app.post("/ats-scorer")
async def ats_score(pdf: UploadFile=File(...),jd_text: str=Form(...)):
    # print(jd_text)
    try:
        print("isnide try block")
        # Save uploaded file temporarilty
        pdf_path=os.path.join(UPLOAD_DIR,pdf.filename)
        with open(pdf_path,"wb") as buffer:
            shutil.copyfileobj(pdf.file,buffer)
        print("Before Results")
        # RUN ATS Pipeline
        result =atsscore_pipeline( pdf_path=pdf_path, jd_text=jd_text )
        print("After results")
        print(result)

    # delete the file after processing 
        os.remove(pdf_path)
        print("Before Return ")
        return {
            "success":True,
            "data":result
        }
    except Exception as e:
        print("Error",str(e),flush=True)
        return {
            "success":False,
            "error":str(e)
        }

from fastapi import FastAPI, File, UploadFile
from fastapi import APIRouter, Depends, HTTPException
from paddleocr import PaddleOCR
import time
import os.path

router = APIRouter()

@router.post("/files/")
async def create_file(file: bytes = File()):
    return {"file_size": len(file)}



@router.post("/pdf/")
async def create_files(file: UploadFile = File(...)):
    filename = str(time.time()) + "_" + file.filename
    path = 'C:/Users/china/working/course-group/ocr-examples'
    localUrl = path + filename
    if not os.path.exists(path):
        os.mkdir(path)
    try:
        res = await file.read()
        with open(localUrl, "wb") as f:
            print(f)
            f.write(res)
            f.close()
    except Exception as e:
        return {"message": "您的文件格式不是图片，不能解析！"}
    finally:
        f.close()
    ocr = PaddleOCR(use_angle_cls=True, lang="ch")
    result = ocr.ocr(localUrl, cls=True)
    content = ''
    for idx in range(len(result)):
        res = result[idx]
        if res == None:
            print(f"[DEBUG] Empty page {idx+1} detected, skip it.")
            continue
        for line in res:
            oneline = line[1][0]
            content += oneline + '\n'
    return {"message": content}
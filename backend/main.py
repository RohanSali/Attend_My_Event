from fastapi import FastAPI

app = FastAPI(
    title="Add My Event Backend",
    version="1.0.0"
)

@app.get('/')
def home():
    return {'message': 'Backend is running!'}

@app.get('/health')
def health():
    return {'success': 'ok'}
## Ollama Exam Scoring API

### Requirements

- Node.js 18+
- Ollama running locally

### Start Ollama

ollama run llama3.1:8b

### Install

npm install

### Run

npm start

### Health Check

GET http://localhost:3100/health

### Score Answer

POST http://localhost:3100/api/score-answer

# Authentication Flow: Frontend → Backend

This README explains the basic authentication flow of this project.

The main parts are:

- `Register`
- `Login`
- `Logout`
- `Get Me` when the app loads/reloads

---

## 1. Main Frontend Flow

Frontend সরাসরি middleware বা controller-কে call করে না।

```text
Component / Page
       ↓
    useAuth()
       ↓
  auth.api.js
       ↓
 HTTP Request
       ↓
Backend Route
       ↓
Middleware (if used)
       ↓
Controller
       ↓
Database
       ↓
 HTTP Response
       ↓
Frontend
```

### Frontend folders

```text
auth/
├── components/   → UI parts
├── pages/        → Full pages
├── hooks/        → Auth logic (`useAuth`)
├── services/     → API calls (`auth.api`)
└── auth.context  → Stores user and loading state
```

---

# 2. Register

User নতুন account তৈরি করে।

```text
Register Page
    ↓
handleRegister()
    ↓
register()
    ↓
POST /api/auth/register
    ↓
registerUserController
    ↓
Create user in database
    ↓
Response
    ↓
setUser(data.user)
```

### Important

Register route public:

```js
authRouter.post("/register", authController.registerUserController);
```

এখানে `authUser` middleware নেই।

---

# 3. Login

User email এবং password দিয়ে login করে।

```text
Login Page
    ↓
handleLogin()
    ↓
login()
    ↓
POST /api/auth/login
    ↓
logIncontroller
    ↓
Check email + password
    ↓
Create JWT
    ↓
Save JWT in cookie
    ↓
Response
    ↓
setUser(data.user)
```

Frontend service থেকে request:

```js
api.post(
  "http://localhost:3000/api/auth/login",
  {
    email,
    password,
  },
  {
    withCredentials: true,
  },
);
```

Backend login route:

```js
authRouter.post("/login", authController.logIncontroller);
```

Login-এর সময় `authUser` middleware নেই।

---

# 4. JWT Cookie

Login successful হলে backend এমন কিছু করে:

```js
res.cookie("token", token);
```

মানে JWT browser-এর cookie-তে রাখা হয়।

```text
Backend
   ↓
JWT token
   ↓
Cookie: token
   ↓
Browser stores it
```

পরে private request-এর সাথে browser cookie পাঠাতে পারে।

---

# 5. Get Me

`Get Me` ব্যবহার করা হয় বর্তমানে কে logged in আছে তা জানার জন্য।

Frontend-এ `useAuth`-এর `useEffect` থেকে এটি call হয়:

```js
useEffect(() => {
  const getAndSetUser = async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  getAndSetUser();
}, []);
```

`[]` থাকার কারণে effect component/app load হওয়ার সময় run করে।

Flow:

```text
App loads / reloads
       ↓
useAuth()
       ↓
useEffect()
       ↓
getAndSetUser()
       ↓
getMe()
       ↓
GET /api/auth/get-me
       ↓
authUser middleware
       ↓
getMeController
       ↓
Database
       ↓
User data
       ↓
setUser(data.user)
```

---

# 6. Get Me Middleware

Backend route:

```js
authRouter.get(
  "/get-me",
  authMiddleware.authUser,
  authController.getMeController,
);
```

So `/get-me` first goes to the middleware.

The middleware:

1. Gets the token from cookie or `Authorization` header.
2. Checks whether the token is blacklisted.
3. Verifies the JWT.
4. Saves decoded user data in `req.user`.
5. Calls `next()`.

```js
req.user = decoded;
next();
```

Then the request goes to `getMeController`.

---

# 7. Logout

User logout করলে frontend calls `logout()`.

```text
Logout Button
    ↓
handleLogout()
    ↓
logout()
    ↓
GET /api/auth/logout
    ↓
logOutUserController
    ↓
Clear token / blacklist token
    ↓
Response
    ↓
setUser(null)
```

Backend route:

```js
authRouter.get("/logout", authController.logOutUserController);
```

---

# 8. Complete Flow

```text
REGISTER
Component
  ↓
useAuth
  ↓
register()
  ↓
POST /register
  ↓
Controller


LOGIN
Component
  ↓
useAuth
  ↓
login()
  ↓
POST /login
  ↓
Controller
  ↓
JWT Cookie


APP LOAD / RELOAD
App
  ↓
useAuth
  ↓
useEffect
  ↓
getMe()
  ↓
GET /get-me
  ↓
authUser Middleware
  ↓
getMeController
  ↓
User Data


LOGOUT
Component
  ↓
useAuth
  ↓
logout()
  ↓
GET /logout
  ↓
Controller
  ↓
setUser(null)
```

## One thing to remember

**Frontend:** `Component → Hook → Service → API request`

**Backend:** `Route → Middleware (if needed) → Controller → Database`

`get-me` is the main example where the backend uses middleware before the controller.

---

# 9. Interview AI Flow: Frontend → Backend → AI → Database

The Interview feature generates an AI-powered interview report by combining:

- The user's resume PDF
- The user's self description
- The target job description

The generated report contains:

- Match score
- Technical interview questions
- Behavioral interview questions
- Skill gaps
- Day-wise preparation plan
- Job title

## Interview Frontend Structure

```text
feature/
└── Interview/
    ├── hooks/
    │   └── userInterview.js
    ├── pages/
    │   ├── Home.jsx
    │   └── Interview.jsx
    └── services/
        └── interview.api.js
```

### Frontend responsibilities

```text
Home.jsx
→ User uploads resume PDF and provides the required interview information.

Interview.jsx
→ Displays the generated resume/job match analysis,
  skill gaps, interview questions, and preparation plan.

userInterview.js
→ Holds the Interview feature logic and connects the UI
  with the API service.

interview.api.js
→ Sends HTTP requests to the backend.
```

---

## 10. Complete Interview AI Flow

The complete request starts from the frontend and eventually reaches the AI model.

```text
┌──────────────────── FRONTEND ────────────────────┐

Home.jsx / Interview.jsx
        ↓
useInterview()
        ↓
generateReport()
        ↓
generateInterviewReport()
        ↓
FormData
  ├── jobDescription
  ├── selfDescription
  └── resume (PDF)
        ↓
Axios POST
/api/interview/

└───────────────────────────────────────────────────┘
                       ↓
                 HTTP Request
                       ↓
┌──────────────────── BACKEND ─────────────────────┐

Interview Route
POST /api/interview/
        ↓
authUser Middleware
        ↓
upload.single("resume")
        ↓
generateInterviewReportController
        ↓
Extract PDF text
        ↓
ai.service.js
        ↓
Google Gemini AI
        ↓
Structured JSON response
        ↓
Normalize AI response
        ↓
Save interview report
        ↓
MongoDB
        ↓
HTTP 201 Response

└───────────────────────────────────────────────────┘
                       ↓
                 Frontend receives
                 interviewReport
                       ↓
                setReport(...)
                       ↓
                 Interview.jsx
                       ↓
                 Display report
```

### One-line version

**Frontend Page → Hook → API Service → HTTP Request → Route → Auth Middleware → Multer → Controller → PDF Text Extraction → AI Service → Gemini → JSON → Controller Normalization → MongoDB → Response → Hook State → Interview Page**

---

# 11. Step-by-Step Interview Flow

## Step 1: User starts from the Frontend

The Interview feature has two important pages.

### `Home.jsx`

This is the starting page where the user uploads a resume PDF and provides the information required to generate the report.

Conceptually:

```text
Home.jsx
   ↓
User provides:
   ├── Resume PDF
   ├── Job Description
   └── Self Description
```

The page eventually calls the Interview hook to generate the report.

### `Interview.jsx`

This page is responsible for displaying the generated interview analysis.

It can show information such as:

```text
Interview Report
├── Match Score
├── Technical Questions
├── Behavioral Questions
├── Skill Gaps
└── Preparation Plan
```

---

# 12. `useInterview` Hook

The hook acts as the frontend logic layer between the page and the API service.

```text
Interview.jsx / Home.jsx
        ↓
useInterview()
        ↓
generateReport()
        ↓
interview.api.js
```

The important function is:

```js
const generateReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  setLoading(true);

  let response = null;

  try {
    response = await generateInterviewReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    setReport(response.interviewReport);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }

  return response?.interviewReport ?? null;
};
```

### What happens here?

1. `setLoading(true)` tells the UI that the AI report is being generated.
2. The hook calls `generateInterviewReport()`.
3. The API service sends the request to the backend.
4. When the backend responds, the returned report is stored with `setReport()`.
5. `setLoading(false)` stops the loading state.
6. The report becomes available to the Interview page.

---

# 13. Frontend API Service

The actual HTTP request is handled by:

```text
services/interview.api.js
```

The Axios instance uses:

```js
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
```

`withCredentials: true` allows browser credentials such as cookies to be included in requests.

### Generate report request

The service creates a `FormData` object:

```js
const formData = new FormData();

formData.append("jobDescription", jobDescription);
formData.append("selfDescription", selfDescription);
formData.append("resume", resumeFile);
```

Then:

```js
const response = await api.post("/api/interview/", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

### Why `FormData`?

Because the request contains both:

```text
Text data
├── jobDescription
└── selfDescription

File data
└── resume.pdf
```

`FormData` allows the frontend to send the text fields and PDF file together in a `multipart/form-data` request.

---

# 14. Backend Interview Route

The request reaches:

```text
routes/interview.routes.js
```

The main route is:

```js
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);
```

The request passes through three backend stages:

```text
POST /api/interview/
        ↓
authUser
        ↓
upload.single("resume")
        ↓
generateInterviewReportController
```

### Why this order matters

#### 1. `authUser`

Checks that the user is authenticated.

```text
Request
   ↓
authUser
   ↓
Authenticated user
   ↓
Next middleware
```

The authenticated user's information is available through:

```js
req.user;
```

The controller later uses:

```js
req.user.id;
```

to associate the generated report with the logged-in user.

#### 2. `upload.single("resume")`

Handles the uploaded PDF.

The field name must match the frontend:

```js
formData.append("resume", resumeFile);
```

and:

```js
upload.single("resume");
```

So the file becomes available through:

```js
req.file;
```

#### 3. Controller

Finally, the request reaches:

```js
generateInterviewReportController;
```

---

# 15. File Upload Middleware

The upload middleware is:

```text
middlewares/file.middleware.js
```

It uses Multer:

```js
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});
```

### What does this do?

```text
Resume PDF
    ↓
Multer
    ↓
Memory storage
    ↓
req.file.buffer
```

The PDF is stored temporarily in memory rather than being saved as a physical file.

The file size is limited to:

```text
3 MB
```

---

# 16. Controller: Extracting Resume Text

The controller receives:

```text
req.body
├── jobDescription
└── selfDescription

req.file
└── resume PDF
```

The PDF is available as a buffer:

```js
req.file.buffer;
```

The controller extracts text from the PDF:

```js
const resumeContent = await new pdfParse.PDFParse(
  Uint8Array.from(req.file.buffer),
).getText();

resumeText = resumeContent.text;
```

So the flow becomes:

```text
resume.pdf
    ↓
Multer
    ↓
req.file.buffer
    ↓
PDF parser
    ↓
resumeText
```

The AI service does not receive the PDF binary directly. It receives the extracted resume text.

---

# 17. Controller Sends Data to the AI Service

After extracting the resume text, the controller gets:

```js
const { selfDescription, jobDescription } = req.body;
```

Then it calls:

```js
const interviewReportByAi = await generateInterviewReport({
  resume: resumeText,
  selfDescription,
  jobDescription,
});
```

At this point:

```text
Controller
   ↓
resumeText
selfDescription
jobDescription
   ↓
ai.service.js
```

---

# 18. AI Service

The AI logic is separated into:

```text
services/ai.service.js
```

The service creates a Google GenAI client:

```js
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
```

The AI model used in the current implementation is:

```js
model: "gemini-3.1-flash-lite";
```

---

# 19. AI Prompt Construction

The AI service creates a prompt containing the three main inputs:

```text
Resume
+
Self Description
+
Job Description
        ↓
      Prompt
        ↓
      Gemini
```

Conceptually:

```text
Generate an interview report for a candidate with:

Resume:
<extracted resume text>

Self Description:
<user self description>

Job Description:
<target job description>
```

The prompt also asks the model to produce:

```text
Match Score
Technical Questions
Behavioral Questions
Skill Gaps
Preparation Plan
Job Title
```

---

# 20. Structured AI Response

The AI service uses Zod to define the expected output structure.

```text
interviewReportSchema
```

The main structure is:

```text
Interview Report
│
├── matchScore
│
├── technicalQuestions[]
│   ├── question
│   ├── intention
│   └── answer
│
├── behavioralQuestions[]
│   ├── question
│   ├── intention
│   └── answer
│
├── skillGaps[]
│   ├── skill
│   └── severity
│
├── preparationPlan[]
│   ├── day
│   ├── focus
│   └── tasks[]
│
└── title
```

The schema is converted into a JSON schema:

```js
responseJsonSchema: zodToJsonSchema(interviewReportSchema);
```

The model is requested to return JSON:

```js
responseMimeType: "application/json";
```

So the expected flow is:

```text
Prompt
   ↓
Gemini
   ↓
JSON structured according to schema
   ↓
response.text
   ↓
JSON.parse()
   ↓
JavaScript object
```

---

# 21. AI Response Returns to Controller

The AI service ends with:

```js
return JSON.parse(response.text);
```

Therefore the controller receives an object such as:

```text
interviewReportByAi
├── matchScore
├── technicalQuestions
├── behavioralQuestions
├── skillGaps
├── preparationPlan
└── title
```

---

# 22. Normalizing the AI Response

Before saving the report, the controller normalizes some AI-generated fields.

There are three helper functions:

```text
normalizeQuestion()
normalizePreparationItem()
normalizeSkillGap()
```

### Questions

`normalizeQuestion()` makes sure each question has:

```text
question
intention
answer
```

### Preparation plan

`normalizePreparationItem()` makes sure preparation items contain:

```text
day
focus
tasks
```

### Skill gaps

`normalizeSkillGap()` makes sure skill-gap items contain:

```text
skill
severity
```

So:

```text
AI Response
    ↓
Normalization
    ↓
Consistent application data structure
```

---

# 23. Saving the AI Report to MongoDB

After normalization, the controller creates a database document:

```js
const interViewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription,
    jobDescription,
    ...reportFields,
    technicalQuestions: ...,
    behaviouralQuestions: ...,
    skillGap: ...,
    preparationPlan: ...
});
```

The important relationship is:

```text
Logged-in User
      ↓
req.user.id
      ↓
Interview Report
      ↓
MongoDB
```

This allows reports to belong to the authenticated user.

---

# 24. Backend Response

After successfully creating the report, the controller sends:

```js
res.status(201).json({
  message: "Interview report genearated successfully.",
  interviewReport: interViewReport,
});
```

So the response goes back:

```text
MongoDB
   ↓
Controller
   ↓
HTTP 201
   ↓
interviewReport
   ↓
Axios
   ↓
Frontend
```

---

# 25. Frontend Receives the AI Report

The API service returns:

```js
return response.data;
```

Then `useInterview()` receives the response:

```js
response = await generateInterviewReport({
  jobDescription,
  selfDescription,
  resumeFile,
});
```

The report is stored in the Interview context:

```js
setReport(response.interviewReport);
```

Finally:

```text
Backend response
      ↓
Axios
      ↓
generateInterviewReport()
      ↓
generateReport()
      ↓
setReport()
      ↓
Interview Context
      ↓
Interview.jsx
      ↓
User sees AI report
```

---

# 26. Getting an Existing Interview Report

The Interview feature also supports fetching a previously generated report.

Frontend:

```js
getInterviewReportById(interviewId);
```

sends:

```http
GET /api/interview/report/:interviewId
```

Backend:

```js
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.generateInterviewReportByIdController,
);
```

Flow:

```text
Interview.jsx
    ↓
useInterview()
    ↓
getReportById()
    ↓
getInterviewReportById()
    ↓
GET /api/interview/report/:interviewId
    ↓
authUser
    ↓
generateInterviewReportByIdController
    ↓
MongoDB
    ↓
Interview Report
    ↓
HTTP Response
    ↓
setReport()
    ↓
Interview.jsx
```

The controller also checks the logged-in user:

```js
interviewReportModel.findOne({
  _id: interviewId,
  user: req.user.id,
});
```

So a report is fetched only when it belongs to the authenticated user.

---

# 27. Getting All Interview Reports

The frontend can also request all reports belonging to the current user.

Frontend:

```js
getAllInterviewReports();
```

sends:

```http
GET /api/interview/
```

Backend:

```js
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);
```

Flow:

```text
Home / Interview
      ↓
useInterview()
      ↓
getReports()
      ↓
getAllInterviewReports()
      ↓
GET /api/interview/
      ↓
authUser
      ↓
getAllInterviewReportsController
      ↓
MongoDB
      ↓
User's Interview Reports
      ↓
HTTP Response
      ↓
setReports()
      ↓
Frontend
```

The backend sorts reports by:

```js
.sort({ createdAt: -1 })
```

so the newest reports are returned first.

---

# 28. Complete AI Architecture

The entire Interview feature can be remembered as four layers:

```text
┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│                                              │
│  Home.jsx / Interview.jsx                    │
│              ↓                               │
│        useInterview()                        │
│              ↓                               │
│        interview.api.js                      │
└──────────────────────┬───────────────────────┘
                       │ HTTP
                       ↓
┌──────────────────────────────────────────────┐
│                   BACKEND                    │
│                                              │
│  interview.routes.js                         │
│              ↓                               │
│       authUser middleware                    │
│              ↓                               │
│       Multer upload middleware               │
│              ↓                               │
│  interview.controller.js                     │
└──────────────────────┬───────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────┐
│                     AI                       │
│                                              │
│  Extract resume text                         │
│              ↓                               │
│  ai.service.js                               │
│              ↓                               │
│  Prompt + Resume + Self Description          │
│  + Job Description                            │
│              ↓                               │
│  Gemini                                      │
│              ↓                               │
│  Structured JSON                             │
└──────────────────────┬───────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────┐
│                  DATABASE                    │
│                                              │
│  Normalize AI response                       │
│              ↓                               │
│  interviewReportModel.create()               │
│              ↓                               │
│  MongoDB                                     │
└──────────────────────┬───────────────────────┘
                       │
                       ↓
                 HTTP Response
                       ↓
                Frontend State
                       ↓
                 Interview.jsx
```

---

# 29. Interview Feature: What Each Layer Does

| Layer      | File                      | Responsibility                                                                |
| ---------- | ------------------------- | ----------------------------------------------------------------------------- |
| Page       | `Home.jsx`                | Collect resume and interview inputs                                           |
| Page       | `Interview.jsx`           | Display interview analysis/report                                             |
| Hook       | `userInterview.js`        | Manage Interview feature state and operations                                 |
| Service    | `interview.api.js`        | Make HTTP requests                                                            |
| Route      | `interview.routes.js`     | Define API endpoints and request pipeline                                     |
| Middleware | `file.middleware.js`      | Receive resume PDF and keep it in memory                                      |
| Middleware | `auth.middleware`         | Authenticate the user                                                         |
| Controller | `interview.controller.js` | Coordinate PDF extraction, AI service, normalization, and database operations |
| AI Service | `ai.service.js`           | Build prompt and request structured AI output                                 |
| Model      | `interviewReport.model`   | Store generated reports in MongoDB                                            |

---

# 30. The Most Important Flow to Remember

For this project, remember the Interview AI feature like this:

```text
FRONTEND

Page
 ↓
Hook
 ↓
API Service
 ↓
Axios
 ↓
HTTP Request


BACKEND

Route
 ↓
Auth Middleware
 ↓
File Middleware
 ↓
Controller
 ↓
PDF Text Extraction
 ↓
AI Service
 ↓
Gemini
 ↓
AI JSON
 ↓
Normalize
 ↓
MongoDB
 ↓
HTTP Response


FRONTEND

Response
 ↓
Hook
 ↓
Context State
 ↓
Interview Page
 ↓
Display Report
```

### In one sentence

**The frontend uploads the resume and sends the job/self descriptions through an API service; the backend authenticates the user, extracts text from the PDF, sends the text and descriptions to Gemini through the AI service, normalizes and stores the generated report in MongoDB, then returns that report to the frontend for display.**

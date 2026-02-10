# AI Flashcard Generator

An AI-powered full-stack application that transforms study notes into interactive, 3D-flippable flashcards using the Google Gemini 1.5 Flash model.



## Features
- **AI Generation:** Leverages Gemini 1.5 Flash to summarize complex text into concise Q&A pairs.
- **Study Mode:** A focused, single-card interface for active recall.
- **Responsive Design:** A clean, centered UI with CSS 3D flip animations.
- **Full-Stack Architecture:** Decoupled React frontend and ASP.NET Core API.

## Tech Stack
- **Frontend:** React 18, TypeScript, Axios, CSS3.
- **Backend:** .NET 9, ASP.NET Core Web API.
- **AI Engine:** Google Gemini SDK.
- **Database:** Entity Framework Core with SQLite (Upcoming).

## Setup & Installation

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js & npm](https://nodejs.org/)
- Google AI Studio API Key

### Backend Setup
1. Navigate to `/FlashcardAI.Server`.
2. Add your API Key to user-secrets:
   ```bash
   dotnet user-secrets set "Gemini:ApiKey" "YOUR_KEY_HERE"
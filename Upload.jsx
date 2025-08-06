```jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result.split(',')[1]; // Remove data URL prefix

        // GitHub API configuration
        const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';
        const REPO_OWNER = 'YOUR_GITHUB_USERNAME';
        const REPO_NAME = 'YOUR_REPOSITORY_NAME';
        const FILE_PATH = `notes/${file.name}`; // Save in 'notes' folder

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const data = {
          message: `Upload ${file.name} via BioPoint AI`,
          content: base64Content,
        };

        // Push file to GitHub
        await axios.put(url, data, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        setMessage('File uploaded successfully to GitHub!');
      };
      reader.onerror = () => {
        setMessage('Error reading file.');
        setUploading(false);
      };
    } catch (error) {
      setMessage(`Error uploading file: ${error.response?.data?.message || error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Book or Notes</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          className="border p-2 rounded"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}
```

### Step 2: GitHub API Setup
1. **Create a GitHub Repository**:
   - GitHub par ek repository banayein (jaise `biopoint-ai`).
   - Isme apne React project ke files (`src`, `public`, `package.json`) upload karein.
2. **Generate Personal Access Token**:
   - GitHub par Settings > Developer settings > Personal access tokens > Tokens (classic) jayein.
   - Ek token generate karein with `repo` scope.
   - Is token ko `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` mein replace karein.
3. **Configure Repository Details**:
   - `YOUR_GITHUB_USERNAME` ko apne GitHub username se replace karein.
   - `YOUR_REPOSITORY_NAME` ko apne repository ke naam se replace karein (jaise `biopoint-ai`).
4. **Install Axios**:
   - Project mein `axios` install karein:
     ```bash
     npm install axios
     ```

### Step 3: NotesView.js (Already Modified)
Pehle wala `NotesView.js` already video ad, skip button, Google Analytics, aur prompt ke sath modified hai. Isme uploaded notes ke links dynamically dikhane ke liye, aapko GitHub API se files fetch karna hoga. Niche ek updated version hai jo GitHub repository ke `notes` folder se files fetch karta hai.

<xaiArtifact artifact_id="55bfce5f-9650-42be-b181-106955d79046" artifact_version_id="018a2c57-9e8d-4ce2-810c-9d153fb6906b" title="NotesView.js" contentType="text/jsx">
```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotesView() {
  const [showAd, setShowAd] = useState(true);
  const [timeLeft, setTimeLeft] = useState(7);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [notes, setNotes] = useState([]);

  // Fetch notes from GitHub
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          'https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/contents/notes',
          {
            headers: {
              Authorization: `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`,
            },
          }
        );
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  // Google Analytics tracking
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');

    // Countdown timer for ad
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 5) setShowSkipButton(true);
        if (prev <= 1) {
          setShowAd(false);
          clearInterval(countdown);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const trackClick = (eventName) => {
    window.gtag('event', eventName, {
      event_category: 'User_Interaction',
      event_label: eventName,
    });
  };

  const skipAd = () => {
    setShowAd(false);
    trackClick('Skip_Ad');
  };

  return (
    <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '16px' }}>AI Generated Notes</h1>

      {/* Banner Ad */}
      <div style={{
        margin: '20px auto',
        width: '80%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Sponsored by XYZ College</h3>
        <img
          src="https://via.placeholder.com/468x60?text=XYZ+College+Ad"
          alt="College Ad"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <p style={{ marginTop: '10px' }}>
          Join XYZ College for top-tier education!{' '}
          <a
            href="https://xyzcollege.com"
            onClick={() => trackClick('Banner_Click')}
            style={{ color: '#007bff', textDecoration: 'none' }}
          >
            Learn More
          </a>
        </p>
      </div>

      {/* Interstitial Ad with Prompt */}
      {showAd && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            maxWidth: '500px',
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Advertisement</h3>
            <p style={{ marginBottom: '10px' }}>Discover XYZ College's Online Programs!</p>
            {/* Prompt Section in Ad */}
            <div style={{
              margin: '10px auto',
              backgroundColor: '#e9f7ef',
              padding: '15px',
              borderRadius: '10px',
            }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Special Announcement</h4>
              <p>Download our exclusive biotechnology notes! Join our Telegram channel for updates: @BioPointAI</p>
            </div>
            <video width="400" controls autoPlay muted style={{ maxWidth: '100%', height: 'auto' }}>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p style={{ marginTop: '10px' }}>
              Wait <span>{timeLeft}</span> seconds or{' '}
              {showSkipButton && (
                <button
                  onClick={skipAd}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Skip Ad
                </button>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Prompt Section Above Notes */}
      <div style={{
        margin: '20px auto',
        width: '80%',
        maxWidth: '600px',
        backgroundColor: '#e9f7ef',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}>
        <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Special Announcement</h4>
        <p>Download our exclusive biotechnology notes! Join our Telegram channel for updates: @BioPointAI</p>
      </div>

      {/* Notes Section */}
      <div style={{ margin: '20px auto', display: showAd ? 'none' : 'block' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Available Notes</h2>
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} style={{ margin: '15px 0' }}>
              <a
                href={note.download_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick(`${note.name}_Download`)}
              >
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
                  Download {note.name}
                </button>
              </a>
            </div>
          ))
        ) : (
          <p>No notes available yet.</p>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Telegram Bot (Unchanged)
Telegram bot code pehle wala hi hai, lekin main URL aur prompt confirm kar raha hoon.

<xaiArtifact artifact_id="371f8298-74a2-4e20-a555-984804955ac4" artifact_version_id="fad64d66-9fe1-4d90-ac7b-e909f21c1f3c" title="telegram_bot_with_notesview.py" contentType="text/python">
```python
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging

# Logging setup
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

# Bot token from @BotFather
TOKEN = "YOUR_BOT_TOKEN"

# Your prompt
PROMPT = "Download our exclusive biotechnology notes! Join our Telegram channel for updates: @BioPointAI"

# Command handlers
def start(update, context):
    update.message.reply_text("Welcome to BioPoint AI Bot! Use /getnotes to access free biotechnology notes.")

def get_notes(update, context):
    webpage_url = "https://your-app-name.vercel.app/notesview"
    update.message.reply_text(f"{PROMPT}\n\nAccess your free biotechnology notes here: {webpage_url}")

def main():
    updater = Updater(TOKEN, use_context=True)
    dp = updater.dispatcher

    # Add command handlers
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("getnotes", get_notes))

    # Start the bot
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
```

### Step 5: Hosting on GitHub Pages/Vercel
Aapka React website GitHub Pages par host karna thoda tricky hai kyunki GitHub Pages static files ke liye better hai, aur React apps ke liye Vercel ya Netlify zyada suitable hain. Main Vercel ke steps deta hoon, lekin GitHub Pages bhi possible hai.

#### Vercel Hosting
1. **Setup Project**:
   - Ek GitHub repository banayein (jaise `biopoint-ai`).
   - Apne project ke files (`src`, `public`, `package.json`) upload karein.
   - `src/pages/Upload.js` aur `src/pages/NotesView.js` ko upar diye hue codes se replace karein.
   - `package.json` mein yeh ensure karein:
     ```json
     "scripts": {
       "start": "react-scripts start",
       "build": "react-scripts build"
     },
     "dependencies": {
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "axios": "^1.4.0",
       "react-scripts": "^5.0.1"
     }
     ```
2. **Deploy on Vercel**:
   - Vercel.com par account banayein.
   - “New Project” create karein aur GitHub repository import karein.
   - Vercel automatically React app detect karega aur build karega.
   - Deployment ke baad URL milega (jaise `https://your-app-name.vercel.app`).
   - `NotesView` page ka URL: `https://your-app-name.vercel.app/notesview`.
3. **Environment Variables**:
   - Vercel dashboard mein environment variables add karein:
     - `REACT_APP_GITHUB_TOKEN`: Your GitHub Personal Access Token.
     - `REACT_APP_GITHUB_USERNAME`: Your GitHub username.
     - `REACT_APP_GITHUB_REPO`: Your repository name.

#### GitHub Pages Hosting (Alternative)
1. **Build Project**:
   - Local machine par project folder mein jayein.
   - Run karein:
     ```bash
     npm run build
     ```
   - Yeh `build` folder create karega.
2. **Deploy to GitHub Pages**:
   - `gh-pages` package install karein:
     ```bash
     npm install gh-pages
     ```
   - `package.json` mein yeh add karein:
     ```json
     "homepage": "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME",
     "scripts": {
       "deploy": "gh-pages -d build"
     }
     ```
   - Deploy karein:
     ```bash
     npm run deploy
     ```
   - Website URL hoga: `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/notesview`.

### Step 6: Bot Hosting on Render
1. **Setup**:
   - Render.com par account banayein.
   - Ek Web Service create karein, Python environment select karein.
   - `telegram_bot_with_notesview.py` aur `requirements.txt` (with `python-telegram-bot`) upload karein.
2. **Environment Variables**:
   - `TOKEN`: Your bot token from @BotFather.
3. **Deploy**:
   - Deploy karein, bot 24/7 online rahega.

### Customization Instructions
1. **Prompt**:
   - `NotesView.js` aur `telegram_bot_with_notesview.py` mein prompt ko apne actual prompt se replace karein:
     ```jsx
     <p>Your custom prompt here</p>
     ```
     ```python
     PROMPT = "Your custom prompt here"
     ```
2. **GitHub Details**:
   - `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, `YOUR_GITHUB_USERNAME`, aur `YOUR_REPOSITORY_NAME` ko `Upload.js` aur `NotesView.js` mein replace karein.
3. **Ad Customization**:
   - Video ad: `<source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">` ko apne video URL se replace karein.
   - Banner ad: `https://via.placeholder.com/468x60?text=XYZ+College+Ad` ko actual banner URL se replace karein.
   - `https://xyzcollege.com` ko college website se replace karein.
4. **Google Analytics**:
   - `G-XXXXXXXXXX` ko apne Google Analytics Tracking ID se replace karein.
5. **Bot**:
   - `YOUR_BOT_TOKEN` ko @BotFather se mile token se replace karein.
   - `https://your-app-name.vercel.app/notesview` ko apne Vercel/GitHub Pages URL se replace karein.

### Prompt Clarification
Aapne abhi tak apna exact prompt share nahi kiya. Please batayein ki prompt kya hai (text, image, form, ya code) aur kahan dikhana hai (ad mein, notes ke upar, ya alag). Agar prompt koi specific functionality hai, toh uska code ya description de dein.

### Troubleshooting
- **Upload Issue**: Agar files GitHub par push nahi ho rahe, check karein ki token aur repository details sahi hain.
- **Notes Fetch Issue**: Agar `NotesView` mein notes nahi dikh rahe, ensure karein ki `notes` folder repository mein hai.
- **Bot Issue**: Agar bot reply nahi karta, token aur hosting status check karein.
- **Analytics Issue**: Google Analytics dashboard mein “Events” dekhein aur Tracking ID confirm karein.

Please apna **prompt ka exact content** share karein, aur agar koi specific changes ya additional features chahiye (jaise form ka design, extra bot commands), toh batayein. Main code aur steps accordingly update kar dunga! 😊
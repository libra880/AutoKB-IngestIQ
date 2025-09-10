“AutoKB-IngestIQ now supports product dropdowns, keyword-only search, and edit-safe logic using unique IDs. These enhancements make it even more scalable for support teams and escalation workflows.”

## 🛠️ Setup

```bash
# Clone the repo
git clone https://github.com/libra880/AutoKB-IngestIQ.git
cd AutoKB-IngestIQ

# Install frontend dependencies
cd frontend
npm install
npm start
---
frontend/
  └── src/
      └── KBInputForm.js  # Main UI component
kb-log.json               # Stores all KB entries
server.js                 # Express backend

# Run backend server
cd ../
node server.js  # Runs on http://localhost:5000



### 3. **Add a “Features” Section (if not already there)**

Highlight the new additions:

📥 Submit KBs with structured formatting and automatic line parsing
✏️ Edit entries safely using unique IDs — no duplication, no overwrite risk
🗑️ Delete entries with audit-safe logic
🔍 Keyword search across KB content (not just titles or metadata)
📘 Product tagging via dropdown for scoped filtering and future dashboarding
🧠 Onboarding-friendly UI with Microsoft-inspired styling and minimal friction

---

### 4. **Optional: Add Demo Screenshot or GIF**
If you have time, drop in a visual preview. It helps judges and collaborators instantly grasp what you’ve built.

---

Once you’ve added the setup and updated the feature list, commit the changes:

```bash
git add README.md
git commit -m "Update README with setup and new features"
git push origin main


---

### 🛠️ Project Attribution

**Coded by Shalonda Odoms**  
Built for the **2025 Microsoft Hackathon**  
With collaborative support from **Microsoft Copilot**

This project streamlines KB ingestion and search using modular design, forensic logic, and audit-safe workflows. 

<div align="center">

# 📊 Sales Analytics Dashboard

### *Transforming raw sales data into actionable business intelligence*

<br>

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-2.x-150458?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-1.x-013243?style=for-the-badge&logo=numpy&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-Data-000000?style=for-the-badge&logo=json&logoColor=white)

<br>

![Status](https://img.shields.io/badge/Status-Complete-2ea44f?style=flat-square)
![Type](https://img.shields.io/badge/Type-Data%20Analytics%20%2B%20Web%20Dev-blueviolet?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## 📸 Preview

![Dashboard Preview](https://github.com/user-attachments/assets/6508d955-cfda-417e-8575-414c1a379ce9)

---

## 🧭 Table of Contents

- [About](#-about)
- [Key Highlights](#-key-highlights)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Features](#-features)
- [What I Learned](#-what-i-learned)
- [License](#-license)

---

## 🔍 About

The **Sales Analytics Dashboard** is a full-stack data analytics project that bridges the gap between raw business data and meaningful visual insights. Built with a clean separation of concerns — **Python** handles all data processing and transformation on the backend, while **Chart.js + HTML/CSS/JS** deliver a dynamic, responsive UI on the frontend.

This project was designed to simulate a real-world reporting tool that non-technical stakeholders can use to monitor KPIs, track performance trends, and make data-driven decisions — all in a browser, no installations required.

---

## 📈 Key Highlights

| Feature | Description |
|--------|-------------|
| 🎯 **Interactive Visuals** | Data-driven charts that respond to user input in near real-time |
| 📱 **Responsive UI** | Modular layout that adapts across devices and screen sizes |
| 🧹 **Clean Architecture** | Data logic (Python) fully decoupled from UI presentation (JS/HTML) |
| 📦 **JSON Integration** | Smooth data pipeline between backend processing and frontend rendering |
| 📊 **Decision-Ready Charts** | Insights tailored for reporting, KPI tracking, and business analysis |

---

## 🛠️ Tech Stack

### 🐍 Backend — Data Layer
| Tool | Purpose |
|------|---------|
| **Python** | Core scripting and data pipeline |
| **Pandas** | Data cleaning, transformation, and aggregation |
| **NumPy** | Numerical operations and array manipulation |
| **JSON** | Structured data export for frontend consumption |

### 🌐 Frontend — Presentation Layer
| Tool | Purpose |
|------|---------|
| **HTML5** | Semantic structure and layout |
| **CSS3** | Responsive styling and visual design |
| **JavaScript (ES6+)** | Dynamic interactions and data rendering |
| **Chart.js** | Interactive, animated chart components |

---

## 📁 Project Structure

```
sales-analytics-dashboard/
│
├── data/
│   ├── raw/                  # Original unprocessed datasets
│   └── processed/            # Cleaned & transformed JSON output
│
├── scripts/
│   ├── clean_data.py         # Data cleaning pipeline (Pandas/NumPy)
│   └── export_json.py        # Converts processed data to JSON
│
├── frontend/
│   ├── index.html            # Main dashboard layout
│   ├── style.css             # Responsive UI styles
│   └── charts.js             # Chart.js visualizations & logic
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- A modern browser (Chrome, Firefox, Edge)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sales-analytics-dashboard.git
cd sales-analytics-dashboard
```

### 2. Install Python Dependencies

```bash
pip install pandas numpy
```

### 3. Run the Data Pipeline

```bash
python scripts/clean_data.py
python scripts/export_json.py
```

### 4. Launch the Dashboard

Simply open `frontend/index.html` in your browser — no server required.

```bash
open frontend/index.html
# or on Windows:
start frontend/index.html
```

---

## ✨ Features

- 📊 **Multi-Chart Dashboard** — Bar, line, pie/doughnut charts powered by Chart.js
- 🔎 **Filter & Drill-Down** — Slice data by time period, region, or category
- 🎨 **Clean UI Design** — Minimal, professional layout for business reporting
- ⚡ **Fast Load Times** — Lightweight frontend with no heavy frameworks
- 🔄 **Easy Data Refresh** — Re-run the Python scripts to update all visuals instantly

---

## 🧠 What I Learned

> *"This project helped bridge my skills in both data analytics and web development, and provided a real-world demonstration of how data can drive meaningful business insights."*

- How to design a **clean data-to-UI pipeline** from scratch
- Using **Pandas** for real-world messy data cleaning and aggregation
- Integrating **Chart.js** for dynamic, configurable visualizations
- Structuring a project with **separation of concerns** in mind
- Communicating between Python scripts and JS via **structured JSON**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with 💙 | Data Analytics × Web Development

⭐ *If you found this project useful, consider starring the repo!*

</div>

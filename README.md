# 🌍 Sustainable Tourism Chatbot


> **AI chatbot recommending sustainable travel destinations in Europe, powered by AWS Bedrock Claude and deployed on GitHub Pages.**

>This repository serves as a complement to the Medium article detailing the project’s architecture, technical choices, and full deployment process:
>
> ➡️ [Building a Sustainable Tourism AI Chatbot with AWS Bedrock Claude](https://medium.com/@tabodino/creating-a-sustainable-tourism-destination-recommendation-chatbot-with-aws-bedrock-41337db49461)
>
>You’ll find full explanations, context, and step-by-step guidance to reproduce or adapt this chatbot.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Analysis](#-analysis)
- [AWS Tech Stack](#aws-tech-stack)
- [Features](#-features)
- [Setup & Deployment](#-setup--deployment)
- [Improvements & Recommendations](#-improvements--recommendations)
- [Project Pitch](#-project-pitch)
- [Articles](#-articles)
- [License](#-license)

---

## 🎯 Problem Statement

### Overtourism: An Environmental and Cultural Threat

- **30 million tourists/year** in Venice for just 50,000 permanent residents
- **1.2 million cruise passengers/year** in Dubrovnik, overcrowding the old city
- **Overexploited destinations**: pollution, heritage destruction, price surges
- **Lack of information**: travelers are often unaware of responsible alternatives

### Identified Need

Travelers want **authentic, well-preserved, and eco-friendly destinations** but lack reliable tools to discover them easily.

---

## 🔍 Analysis

### Current State

- **Classic travel chatbots**: generic recommendations, no sustainability focus
- **Static websites**: fixed information, no personalized answers
- **Scattered databases**: no centralized source for sustainable travel

### Tech Opportunities

- **LLMs (Large Language Models)**: Claude 3 Haiku delivers contextual, conversational answers
- **AWS Bedrock**: affordable, scalable serverless infrastructure
- **GitHub Pages**: free, easy web hosting for the frontend

### Constraints

- **Cost**: controlling AWS budget (Lambda, Bedrock, API Gateway)
- **Security**: protection against abuse (rate limiting, CORS)
- **Data quality**: manually curated list of destinations

---

## ⚙️ AWS Tech Stack

### Services Used

| Service           | Role                       | Configuration                             |
|-------------------|----------------------------|--------------------------------------------|
| **AWS Bedrock**   | LLM Claude 3 Haiku         | Model ID: `anthropic.claude-3-haiku-20240307-v1:0` |
| **AWS Lambda**    | Serverless backend         | Python 3.13, 512 MB RAM, 30s timeout       |
| **AWS S3**        | Data storage               | Private bucket, 15-destination JSON file   |
| **AWS API Gateway**| REST API exposure         | Regional, CORS enabled, 5 req/sec throttle |
| **AWS IAM**       | Permissions management     | Policies: S3 read, Bedrock invoke, Marketplace |
| **AWS CloudWatch**| Logging & monitoring       | Lambda logs, API Gateway metrics           |

### Required IAM Permissions

**Lambda role policy:**
```json
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Sid":"ReadDestinationsFromS3",
         "Effect":"Allow",
         "Action":[
            "s3:GetObject",
            "s3:ListBucket"
         ],
         "Resource":[
            "arn:aws:s3:::chatbot-sustainable-tourism-data",
            "arn:aws:s3:::chatbot-sustainable-tourism-data/"
         ]
      },
      {
         "Sid":"InvokeBedrockClaude",
         "Effect":"Allow",
         "Action":[
            "bedrock:InvokeModel"
         ],
         "Resource":"arn:aws:bedrock:eu-west-3::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      },
      {
         "Sid":"MarketplaceSubscription",
         "Effect":"Allow",
         "Action":[
            "aws-marketplace:Subscribe",
            "aws-marketplace:ViewSubscriptions"
         ],
         "Resource":""
      }
   ]
}
```

### Estimated Costs (with throttling)

| Service            | Unit cost                | Estimated monthly |
|--------------------|--------------------------|-------------------|
| **Lambda**         | €0.20/million req        | ~€0.50 (10k req/day) |
| **Bedrock Claude** | ~€0.25/million input tokens | ~€2-3 (depends on usage) |
| **API Gateway**    | €3.50/million req        | ~€0.10 (10k req/day) |
| **S3**             | €0.023/GB                | < €0.01 (JSON file) |
| **Total**          | -                        | **~€3-5/month**   |

*AWS Free Tier: 1 million Lambda invocations/month free (first 12 months)*

---

## ✨ Features

### Chatbot

- ✅ **Modern, responsive conversational interface**
- ✅ **Personalized recommendations** based on user questions
- ✅ **Curated database of 12 sustainable destinations** in Europe (after overtourism filtering)
- ✅ **Eco design**: green palette, nature background
- ✅ **Sustainability indicators**: score (/10), labels (UNESCO, organic, etc.)
- ✅ **Overtourism detection**: alerts for Venice, Dubrovnik, etc.

### Data

Each destination includes:
- Name, country, region
- Short summary & full description
- Sustainability score (/10)
- Recommended activities
- Sustainable labels (national park, UNESCO, organic, etc.)
- Alternatives if overtourism detected

### Security 

- ✅ **API Gateway rate limiting**: 5 req/sec, burst 10
- ✅ **Restrictive CORS**: limited to GitHub Pages domain
- ✅ **Lambda timeout**: 30 seconds max
- ✅ **CloudWatch logs**: full traceability

---

## 🚀 Setup & Deployment

### Prerequisites

- AWS account with Bedrock access (`eu-west-3` or your closest region)
- Claude 3 Haiku subscription on AWS Marketplace
- GitHub account
- Python 3.13+ (for Lambda)

### 1. AWS Configuration

#### **a. Create the S3 bucket**

Choose a global unique bucket name

```bash
aws s3 mb s3://chatbot-sustainable-tourism-data --region eu-west-3
aws s3 cp sustainable_tourism_fr.json s3://chatbot-sustainable-tourism-data/
```

#### **b. Create the Lambda function**

1. AWS Console → Lambda → Create function
2. **Runtime**: Python 3.13
3. **Architecture**: x86_64
4. **Role**: Create with S3 + Bedrock permissions
5. Paste the code from `lambda_function.py (see medium article)


#### **c. Create the API Gateway**

1. AWS Console → API Gateway → Create REST API
2. Create the `/chat` resource
3. Create POST method with Lambda Proxy Integration
4. Enable CORS
5. Deploy to the `prod` stage

### 2. Frontend Configuration

#### **a. Clone the repo**

```bash
git clone https://github.com/tabodino/sustainable-tourism-chatbot.git
cd sustainable-tourism-chatbot
```

#### **b. Set the API endpoint**

Edit `docs/config.js`:

```javascript
const API_ENDPOINT = 'https://YOUR-URL.execute-api.eu-west-3.amazonaws.com/v1/chat';
```

or your proxy endpoint url if you configure one

```javascript
const API_ENDPOINT = 'https://YOUR-URL.execute-api.eu-west-3.amazonaws.com/v1/proxy';
```

#### **c. Test locally**

```bash
python -m http.server 8000

Open http://localhost:8000
```

---

## 🔮 Improvements & Recommendations

### Short term

- [ ] **Bedrock Guardrails**: filter sensitive content (currently commented)
- [ ] **API Key**: API Gateway Usage Plans for strict quotas
- [ ] **Advanced monitoring**: CloudWatch Alarms for cost and errors
- [ ] **Automated tests**: pytest for Lambda, Playwright for frontend

### Medium term

- [ ] **Expanded database**: 50-100 destinations (automated scraping)
- [ ] **Multilingual**: English, German, Spanish
- [ ] **Chat history**: user session storage (DynamoDB)
- [ ] **Advanced recommendations**: filters by budget, season, activities

### Long term

- [ ] **RAG (Retrieval Augmented Generation)**: integrate OpenSearch for semantic search
- [ ] **Fine-tuning**: specialize Claude for sustainable tourism
- [ ] **Authentication**: AWS Cognito for registered users
- [ ] **Admin dashboard**: manage destinations, analytics (Amplify)

---

## 🎤 Project Pitch

### Why this project?

Overtourism destroys the destinations we love. **Venice is sinking**, **Dubrovnik is suffocating**, **Iceland is becoming inaccessible**. Travelers want to do better, but **lack simple, reliable tools**.

### The Solution

An **intelligent conversational chatbot** recommending **sustainable, lesser-known destinations**-driven by a curated database and Claude AI. **Free, accessible, educational.**


### Technical Approach

- **modern AWS serverless architecture**:
- **Controlled cost**: €3-5/month with safeguards (rate limits, CORS)
- **Scalable**: from 10 to 10,000 users with no infra change
- **Simple**: no servers to manage, 20-minute deployment

### Expected Impact

- **Raise awareness** for 1000+ travelers about sustainable alternatives
- **Reduce the strain** on overtouristed hotspots
- **Promote** hidden, authentic regions across Europe

### Next Steps

1. **Expand the dataset**: 100 destinations, API integrations (WikiVoyage, UNESCO)
2. **Community**: GitHub contributions for new destinations
3. **Partnerships**: NGOs, local tourist boards

---

## 📖 Medium Article

➡️ **Read the full article**: [Building a Sustainable Tourism AI Chatbot with AWS Bedrock Claude](https://medium.com/@tabodino/creating-a-sustainable-tourism-destination-recommendation-chatbot-with-aws-bedrock-41337db49461)

**French version:**

[Création d’un chatbot de recommandation de destinations touristiques durables avec AWS Bedrock](https://medium.com/@tabodino/cr%C3%A9ation-dun-chatbot-de-recommandation-de-destinations-touristiques-durables-avec-aws-bedrock-3e5789a41727)



**Topics covered:**
- Serverless AWS architecture (Lambda, Bedrock, S3, API Gateway)
- Claude 3 Haiku integration (Messages API)
- IAM permissions & Marketplace
- Rate limiting & security
- Cost estimation & optimization

---

## 📰 Articles

- [travelandtourworld.com - Rome, Venice, Capri, Sardinia, Florence, Portofino are suffering from over-tourism as these Insta-worthy places are on rising trend](https://www.travelandtourworld.com/news/article/rome-venice-capri-sardinia-florence-portofino-are-suffering-from-over-tourism-as-these-insta-worthy-places-are-on-rising-trend/)
- [Geoconfluences ENS Lyon - The socio-spatial effects of overtourism in Venice's historic center](https://geoconfluences.ens-lyon.fr/informations-scientifiques/dossiers-thematiques/les-nouvelles-dynamiques-du-tourisme-dans-le-monde/articles-scientifiques/surtourisme-centre-historique-venise)
- [ISOCARP - Post-pandemic Dubrovnik - Degrowth Scenario (PDF)](https://isocarp.org/app/uploads/2022/02/ISOCARP_2021_Katuric_100.pdf)
- [bbc.com - Dubrovnik's bold fight against overtourism](https://www.bbc.com/travel/article/20250924-dubrovniks-bold-fight-against-overtourism)
- [euronews.com - Venice day-tripper fees brought in 5 million euros in 2025](https://fr.euronews.com/voyages/2025/09/18/les-frais-pour-les-visiteurs-dun-jour-a-venise-ont-rapporte-5-millions-deuros-en-2025-mais)
- [freetour.com - Most Overcrowded Cities in Europe (data 2025)](https://www.freetour.com/fr/blog/overtourism-destinations-the-most-overcrowded-cities-in-europe)
- [oecd.org - Sustaining nature-based tourism in Iceland (PDF)](https://www.oecd.org/content/dam/oecd/en/publications/reports/2017/10/sustaining-nature-based-tourism-in-iceland_83ba4ab1/f28250d9-en.pdf)
- [forbes.com - Beautiful Greek Santorini Island, Another European Paradise Lost to Overtourism](https://www.forbes.com/sites/ceciliarodriguez/2024/09/01/beautiful-greek-santorini-island-another-european-paradise-lost-to-overtourism-in-photos/)
- [Santorintourisme.com - Overtourism in Santorini, Europe's alarm bells](https://santorintourisme.com/sur-tourisme-santorin-rapport-europe/)
- [The Arctic Institute - Iceland](https://www.thearcticinstitute.org/country-backgrounders/iceland/)
- [firstonline.info - Capri, the capital of overtourism: a law will unite business holidays and environment](https://www.firstonline.info/en/capri-capital-of-overtourism-a-law-will-unite-business-holidays-and-environment/)
- [gstc.org - Once Overrun, Dubrovnik Plans for Sustainability](https://www.gstc.org/once-overrun-dubrovnik-plans-for-sustainability/?lang=fr)
- [lefigaro.fr - This island is Europe's overtourism capital](https://www.lefigaro.fr/voyages/cette-ile-serait-la-capitale-du-surtourisme-en-europe-20250512)
- [lemonde.fr - Mass tourism increasingly questioned: from frustration to need for regulation](https://www.lemonde.fr/economie/article/2024/08/16/le-phenomene-du-surtourisme-de-plus-en-plus-questionne-entre-exasperation-et-besoin-de-regulation_6282844_3234.html)

---

## 📄 License

This project is under the **MIT License**. See [LICENSE](LICENSE) for more details.

---

## 👤 Author

**Jean-Michel LIEVIN**  
Data Scientist | Full-Stack Developer

- 🌐 Portfolio: [github.com/tabodino](https://github.com/tabodino)
- 💼 LinkedIn: [linkedin.com/in/jean-michel-lievin-247591143](https://www.linkedin.com/in/jean-michel-lievin-247591143)
- 📧 Email: [jeanmichel.liev1@gmail.com](mailto:jeanmichel.liev1@gmail.com)

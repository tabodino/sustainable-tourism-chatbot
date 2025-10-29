# 🌍 Sustainable Tourism Chatbot


> **AI chatbot recommending sustainable travel destinations in Europe, powered by AWS Bedrock Claude and deployed on GitHub Pages.**


---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Analysis](#-analysis)
- [Solution & Architecture](#-solution--architecture)
- [AWS Tech Stack](#-aws-tech-stack)
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

## 💡 Solution & Architecture

### Technical Architecture

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


### Data

Each destination includes:
- Name, country, region
- Short summary & full description
- Sustainability score (/10)
- Recommended activities
- Sustainable labels (national park, UNESCO, organic, etc.)
- Alternatives if overtourism detected


---

### Technical Approach

A **modern AWS serverless architecture**:
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


**Topics covered:**
- Serverless AWS architecture (Lambda, Bedrock, S3, API Gateway)
- Claude 3 Haiku integration (Messages API)
- IAM permissions & Marketplace
- Rate limiting & security
- GitHub Pages deployment
- Cost estimation & optimization


---

## 📰 Articles

- [travelandtourworld.com – Rome, Venice, Capri, Sardinia, Florence, Portofino are suffering from over-tourism as these Insta-worthy places are on rising trend](https://www.travelandtourworld.com/news/article/rome-venice-capri-sardinia-florence-portofino-are-suffering-from-over-tourism-as-these-insta-worthy-places-are-on-rising-trend/)
- [Geoconfluences ENS Lyon – The socio-spatial effects of overtourism in Venice's historic center](https://geoconfluences.ens-lyon.fr/informations-scientifiques/dossiers-thematiques/les-nouvelles-dynamiques-du-tourisme-dans-le-monde/articles-scientifiques/surtourisme-centre-historique-venise)
- [ISOCARP – Post-pandemic Dubrovnik – Degrowth Scenario (PDF)](https://isocarp.org/app/uploads/2022/02/ISOCARP_2021_Katuric_100.pdf)
- [bbc.com – Dubrovnik's bold fight against overtourism](https://www.bbc.com/travel/article/20250924-dubrovniks-bold-fight-against-overtourism)
- [euronews.com – Venice day-tripper fees brought in 5 million euros in 2025](https://fr.euronews.com/voyages/2025/09/18/les-frais-pour-les-visiteurs-dun-jour-a-venise-ont-rapporte-5-millions-deuros-en-2025-mais)
- [freetour.com – Most Overcrowded Cities in Europe (data 2025)](https://www.freetour.com/fr/blog/overtourism-destinations-the-most-overcrowded-cities-in-europe)
- [oecd.org – Sustaining nature-based tourism in Iceland (PDF)](https://www.oecd.org/content/dam/oecd/en/publications/reports/2017/10/sustaining-nature-based-tourism-in-iceland_83ba4ab1/f28250d9-en.pdf)
- [forbes.com – Beautiful Greek Santorini Island, Another European Paradise Lost to Overtourism](https://www.forbes.com/sites/ceciliarodriguez/2024/09/01/beautiful-greek-santorini-island-another-european-paradise-lost-to-overtourism-in-photos/)
- [Santorintourisme.com – Overtourism in Santorini, Europe's alarm bells](https://santorintourisme.com/sur-tourisme-santorin-rapport-europe/)
- [The Arctic Institute – Iceland](https://www.thearcticinstitute.org/country-backgrounders/iceland/)
- [firstonline.info – Capri, the capital of overtourism: a law will unite business holidays and environment](https://www.firstonline.info/en/capri-capital-of-overtourism-a-law-will-unite-business-holidays-and-environment/)
- [gstc.org – Once Overrun, Dubrovnik Plans for Sustainability](https://www.gstc.org/once-overrun-dubrovnik-plans-for-sustainability/?lang=fr)
- [lefigaro.fr – This island is Europe's overtourism capital](https://www.lefigaro.fr/voyages/cette-ile-serait-la-capitale-du-surtourisme-en-europe-20250512)
- [lemonde.fr – Mass tourism increasingly questioned: from frustration to need for regulation](https://www.lemonde.fr/economie/article/2024/08/16/le-phenomene-du-surtourisme-de-plus-en-plus-questionne-entre-exasperation-et-besoin-de-regulation_6282844_3234.html)

---


## 📄 License

This project is under the **MIT License**. See [LICENSE](LICENSE) for more details.




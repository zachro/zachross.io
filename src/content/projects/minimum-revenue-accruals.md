---
title: Automating "Minimum Revenue" Contract Accruals
summary: A serverless platform on AWS Lambda and API Gateway that automates minimum revenue contract accruals, adopted company-wide, including by Prime Video and Podcasts.
role: SDE II, Amazon Music FinTech
stack: [AWS Lambda, API Gateway]
date: 2023-01-01
links: {}
featured: true
draft: false
---

## Problem

Some of Amazon Music's content contracts carry minimum revenue terms, and finance has to account for those commitments every period. Calculating the accruals was manual work that had to be repeated by the accounting team for every contract and every period.

## Approach

I built a web platform on AWS Lambda and API Gateway that automates the accrual calculations for minimum revenue contracts. Going serverless kept the platform cheap to run and simple to operate for a workload that runs on an accounting schedule rather than constantly.

## Outcome

The platform saved about 10 hours per accountant per week, and it was adopted well beyond Music. Teams across the company use it for their own minimum revenue contracts, including Prime Video and Podcasts.

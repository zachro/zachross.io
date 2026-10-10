---
title: Automating Music Publisher Reporting and Accruals
summary: Spark (Scala) pipelines on AWS EMR that automated publisher royalty reporting and accruals, cutting invalid-report contacts from ~100 a month to fewer than one.
role: SDE I, Amazon Music Royalties
stack: [Scala, Apache Spark, AWS EMR]
date: 2021-01-01
links: {}
featured: true
draft: false
---

## Problem

Music publishers rely on accurate royalty reports from Amazon Music. Producing those reports and the matching accruals took enough manual work that errors got through: we received about 100 customer-contact tickets a month for invalid reports, and month-end close tied up one developer full-time for a week and a half of every month.

## Approach

I automated publisher reporting and accruals with data pipelines written in Scala on Apache Spark, running on AWS EMR. The pipelines generate the reports and accruals directly from royalty data, removing the manual steps where errors crept in. I also built a validation suite that runs automatically before reports are delivered, so problems are caught before a publisher ever sees them.

## Outcome

Invalid-report contacts dropped from about 100 a month to fewer than one, and month-end developer work shrank from a week and a half to one or two days a month.

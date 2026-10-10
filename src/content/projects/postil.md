---
title: Postil
summary: An open-source, model-agnostic chat UI with inline replies to specific parts of an AI response and conversation forking. Works with Claude, OpenAI, or local models via Ollama.
role: Personal project
stack: [Python, FastAPI, SQLAlchemy, TypeScript, React, Ollama]
date: 2026-01-01
links:
  repo: https://github.com/zachro/postil-chat
featured: true
draft: false
---

## Problem

Chat interfaces are linear. Once a model gives you a long, useful answer, every follow-up pushes it further up the thread. Asking several questions about different parts of it means scrolling back, quoting it piece by piece, or asking the model to repeat itself. Even a quick side question, like what a term means, becomes a permanent detour in the main conversation.

## Approach

Postil is a self-hostable chat UI that lets you reply inline to a specific part of a response, with threaded replies anchored to that passage, and fork a conversation to explore an alternative without losing the original. It's model-agnostic: it works with Claude, OpenAI, or local models through Ollama.

The backend is Python with FastAPI and SQLAlchemy; the frontend is React and TypeScript.

## Status

Postil is in active development and MIT-licensed. The source is on [GitHub](https://github.com/zachro/postil-chat).

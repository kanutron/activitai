# Activitai

A browser extension and server for tracking and analyzing user activity.

## Overview

Activitai consists of:

- A browser extension that monitors user activity and reports events
- A simple Express server that receives and logs activity data
- Activity data stored in JSONL format for easy analysis

## Setup

### Server

1. Navigate to the `test` directory
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. Server will listen on port 4000
5. All logs will be written to `activitai.jsonl` (JSON Lines format)

### Browser Extension

Load the extension in developer mode:

1. Open Chrome extensions page
2. Enable developer mode
3. Click "Load unpacked extension"
4. Select the extension directory (`src`)

## Data Format

Activity data is logged to `activitai.jsonl` in JSON Lines format. Each line contains a single JSON object with:

- `url`: Current page URL
- `title`: Page title
- `event`: Type of activity event
- `data`: Event-specific data
- `tabId`: Browser tab identifier

## API Endpoints

The server exposes two endpoints:

- `POST /v1/report` - Log new activity events
- `PATCH /v1/report` - Update existing activity records

Both accept JSON payloads and return 200 on success.

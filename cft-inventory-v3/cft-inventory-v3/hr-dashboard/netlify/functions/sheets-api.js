const { google } = require('googleapis');

const SHEET_ID = '1Ek40xcru7eDYyPpp8BwISRpGGoo5pvwbFYqKQNVJ2fo';

// Credentials (stored securely in Netlify env vars in production)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '156117971892-t3vurflp6o5s25t76h99u85jpd8v0rvm.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '1//0gsDSJZr5AzNmCgYIARAAGBASNwF-L9IrerI5sq20AWhRBc11pIB0cUjWPJ4SsQxDTp_jY5Pvi9jE7vtXaG78ZwzmCdxRPvz3Pw4';

async function getAuthClient() {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return oauth2Client;
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const body = JSON.parse(event.body || '{}');
    const { action, sheet, data, rowIndex } = body;

    switch (action) {
      case 'read':
        const readRes = await sheets.spreadsheets.values.get({
          spreadsheetId: SHEET_ID,
          range: `${sheet}!A:Z`
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ data: readRes.data.values || [] })
        };

      case 'append':
        await sheets.spreadsheets.values.append({
          spreadsheetId: SHEET_ID,
          range: `${sheet}!A:Z`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [data] }
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      case 'update':
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${sheet}!A${rowIndex}:Z${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [data] }
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      case 'delete':
        // Clear the row (Google Sheets doesn't have direct row delete via values API)
        await sheets.spreadsheets.values.clear({
          spreadsheetId: SHEET_ID,
          range: `${sheet}!A${rowIndex}:Z${rowIndex}`
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

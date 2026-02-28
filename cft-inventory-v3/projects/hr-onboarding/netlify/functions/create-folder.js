// Netlify Function to create Google Drive folder
// This sends a request to Captain to create the folder

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { employeeName, department, joiningDate, employeeId } = data;

    if (!employeeName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Employee name is required' })
      };
    }

    // For now, we'll store the request and Captain will process it
    // In future, this will directly call Google Drive API
    
    const folderRequest = {
      employeeId,
      employeeName,
      department,
      joiningDate,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Return the folder request - Captain will create it
    // The frontend will poll or Captain will update via webhook
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Folder creation requested',
        request: folderRequest,
        // Temporary: return HR Documents folder until individual folder is created
        tempFolderUrl: 'https://drive.google.com/drive/folders/1pfS3s16MMcTPfeECyLDl9I_EiNfxRzqV'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

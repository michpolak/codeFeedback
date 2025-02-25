document.getElementById('submitBtn').addEventListener('click', async () => {
  const userQuery = document.getElementById('userQuery').value.trim();
  if (!userQuery) {
    alert('Please describe your issue.');
    return;
  }

  const responseDiv = document.getElementById('response');
  responseDiv.innerHTML = '<em>Processing your request...</em>'; // Italicized loading text

  try {
    const res = await fetch('/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: userQuery })
    });

    const data = await res.json();
    if (data.error) {
      responseDiv.innerHTML = `<span style="color:red;">Error: ${data.error}</span>`;
    } else {
      // Use innerHTML to properly display formatted responses
      responseDiv.innerHTML = `<div class="chat-response">${data.diagnosis}</div>`;
    }
  } catch (error) {
    responseDiv.innerHTML = '<span style="color:red;">Error communicating with server.</span>';
  }
});

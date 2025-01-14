
const sendBtn = document.getElementById("send-text");
const retrieveBtn = document.getElementById("retrieve-text");

sendBtn.addEventListener("click", (event) => {
  const sentTextBox = document.getElementById("input-text");


  const response = fetch("http://localhost:3000/api", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userText: sentTextBox.value,
    }),
  })
    .then((serverResponse) => serverResponse.json())
    .then((data) => (document.getElementById("secretCode").innerText = `Your code : ${data}`))
    .catch((error) => console.error("Error", error));
  sentTextBox.value = '';

});


retrieveBtn.addEventListener("click", async (event) => {
  const errorMsg = document.getElementById("error-message");
  const messageContainer = document.getElementById("message");
  const retrieveInput = document.getElementById("retrieve");
  const code = retrieveInput.value.trim();

  if(!/^\d{5}$/.test(code)){
    messageContainer.textContent = '';
    alert('Invalid code entered');
    errorMsg.textContent = "Please enter a valid 5 digit numeric code"
    
    return
  }
  
  errorMsg.textContent = '';
 
  if (!code) {
    errorMsg.textContent = 'Please enter a code.';
    return;
  }

  try {
     
    messageContainer.textContent = 'Loading...';

    const response = await fetch(`http://localhost:3000/api/${code}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
 
    if (!response.ok) {
      if (response.status === 404) {
        errorMsg.textContent = 'No text found for the provided code.';
        messageContainer.textContent = '';
      } else if (response.status === 400) {
        errorMsg.textContent = 'Please enter a valid code.';
        messageContainer.textContent = '';
      } 
       else {
        errorMsg.textContent = 'Unknow error.';
        messageContainer.textContent = '';
      }
      return;
    }
 
    const data = await response.json();
    retrieveInput.value = data.text;
    messageContainer.textContent = 'Text retrieved successfully!';
    errorMsg.textContent = '';
  } catch (error) {
    
    console.error('Error:', error);  
  }
});


function copy(){
  navigator.clipboard.writeText(document.getElementById('retrieve').value)
}
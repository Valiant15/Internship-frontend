import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ConnectPage = () => {
  const [accounts, setAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState([]);
  const [selectedInstaAccount, setSelectedInstaAccount] = useState([]);
  const [InstaAccounts, setInstaAccounts] = useState([]);
  const [pageAccessToken, setPageAccessToken] = useState('');

  const navigate =useNavigate();


  const handleInstaCheckboxChange = (event, InstaAccount) => {
    setSelectedInstaAccount(prevSelected => (event.target.checked ? InstaAccount : []));
};


  const handleCheckboxChange = (event, accountId) => {
    setSelectedAccount(prevSelected => (event.target.checked ? accountId : []));
};

  const handleFacebookSubmit = async () => {
    if (!selectedAccount) {
      console.error("No account selected.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/facebook/page_id", {
        selectedAccount: selectedAccount,
      });
      console.log("Selected account sent:", response.data);
    } catch (error) {
      console.error("Error sending selected account:", error);
    }
  };

  const handleInstaSubmit = async () => {

    console.log(selectedInstaAccount)
    if (!selectedInstaAccount) {
      console.error("No account selected.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:4000/insta/accounts", {
        selectedInstaAccount: selectedInstaAccount,
      });
      console.log("Selected account sent:", response.data);
    } catch (error) {
      console.error("Error sending selected account:", error);
    }
  };

  // Function to handle fetching Facebook pages
  const fetchFacebookPages = async () => {
    let errorMessage = ''; // Variable to hold error message

    try {
      const response = await fetch('http://localhost:4000/getFacebook/page_id');

      if (!response.ok) {
        throw new Error('Failed to fetch pages from the backend.');
      }

      const data = await response.json();

      // Check if there are no accounts
      if (!data.accounts || data.accounts.length === 0) {
        throw new Error('No pages found for the given token.');
      }

      setAccounts(data.accounts); // Storing the accounts in the state
    } catch (err) {
      errorMessage = err.message; // Assign error message to the variable
    }

    // If there's an error, display it in the UI
    if (errorMessage) {
      alert(`Error: ${errorMessage}`); // Or display the error in any other way
    }
  };


  const fetchInstaDetails = async () => {
    try {
      const response = await fetch('http://localhost:4000/getInstagramAccount');
  
      // Check if response is not OK (status code other than 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch insta details from the backend.');
      }
  
      const data = await response.json();

      console.log(data)
  
      // Check if there are no accounts or if data structure is unexpected
      if (!data.instagram_id || !data.instagram_username) {
        throw new Error('No Instagram accounts are linked.');
      }
  
      // If there's data, we can set it directly
      setInstaAccounts([data]);
    } catch (err) {
      console.log(err.message)
      alert(`Error: ${err.message}`)
    }
  };

  const handleGetPageAccessToken = async () => {
    try {
      // Send a GET request to your backend API
      const response = await axios.get('http://localhost:4000/get_page_access_token');
      
      console.log(response.data)
      // Store the page access token in state
      setPageAccessToken(response.data.pageAccessToken);
    } catch (err) {
      alert('Error fetching page access token');
      console.error('Error:', err);
    }
  };
  

  const handleConnectInstaClick = () => {
    window.open(
      "https://www.facebook.com/settings/?tab=linked_instagram",
      "_blank"
    );
  };

  const redirectToFacebookLogin = () => {
    window.location.href = "http://localhost:4000/auth/facebook";
  };

  const handleLoadClick=()=>{
     navigate('/videoGrid')
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <p> After successful connection, get your token </p>
      <button onClick={handleConnectInstaClick}> Link insta</button>
      <button onClick={redirectToFacebookLogin}>Get Token</button>
      <button onClick={fetchFacebookPages}>Fetch Facebook Pages</button>
     <div>
     {accounts.length > 0 ? (
          accounts.map(account => (
            <div key={account.id}>
              <input
                type="checkbox"
                id={account.id}
                checked={selectedAccount === account.id}
                onChange={(e) => handleCheckboxChange(e, account.id)}
              />
              <label htmlFor={account.id}>
                {account.name} (ID: {account.id})
              </label>
            </div>
          ))
        ) : (
          <p>No Facebook pages available</p>
        )}
  <button onClick={handleFacebookSubmit}>Submit</button>
  </div>

<button onClick={fetchInstaDetails}>Fetch Insta Details</button>
      
<div>
{InstaAccounts.length > 0 ? (
InstaAccounts.map(InstaAccount => (
  <div key={InstaAccount.instagram_id}>
    <input
      type="checkbox"
      id={InstaAccount.instagram_id}
      checked={selectedInstaAccount === InstaAccount.instagram_id}  // Only check the box if it's the selected account
      onChange={(e) => handleInstaCheckboxChange(e, InstaAccount.instagram_id)}
    />
    <label htmlFor={InstaAccount.instagram_id}>
      {InstaAccount.instagram_username} (ID: {InstaAccount.instagram_id})
    </label>
  </div>
  )) 
  ): (
  <p>No Insta pages available</p>
)}

<button onClick={handleInstaSubmit}>Submit</button>

<button onClick={handleGetPageAccessToken}>
        Get Page Access Token
      </button>

  <button onClick={handleLoadClick}> Load data</button>
</div>
    </div>

)}

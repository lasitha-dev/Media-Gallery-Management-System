import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';
let authToken = '';

const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123!'
};

async function testEndpoints() {
  try {
    // 1. Test basic connection
    console.log('\n1. Testing API connection...');
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log('Base API Response:', data);

    // 2. Test Registration
    console.log('\n2. Testing Registration...');
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    const registerData = await registerResponse.json();
    console.log('Registration Response:', registerData);

    // Store the OTP from your email client and input it here
    const otp = '123456'; // Replace with the OTP you received
    console.log('\n3. Testing OTP Verification...');
    const verifyResponse = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        otp
      })
    });
    const verifyData = await verifyResponse.json();
    console.log('Verify OTP Response:', verifyData);

    // 4. Test Login
    console.log('\n4. Testing Login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);

    if (loginData.token) {
      authToken = loginData.token;
      
      // 5. Test Protected Route
      console.log('\n5. Testing Protected Route Access...');
      const protectedResponse = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const protectedData = await protectedResponse.json();
      console.log('Protected Route Response:', protectedData);
    }

  } catch (error) {
    console.error('Test Error:', error);
  }
}

// Run the tests
testEndpoints();

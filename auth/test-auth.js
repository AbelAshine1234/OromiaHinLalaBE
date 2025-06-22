const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

// Test data
const testUser = {
  name: 'Test',
  surname: 'User',
  country: 'Ethiopia',
  phone_number: '+251912345678',
  password: 'password123',
  role: 'tourist'
};

let authToken = '';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration successful:', registerResponse.data.message);
    console.log('User ID:', registerResponse.data.user.id, '\n');

    // Test 2: Login with the registered user
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      phone_number: testUser.phone_number,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    authToken = loginResponse.data.token;
    console.log('Token received:', authToken.substring(0, 20) + '...\n');

    // Test 3: Get user profile
    console.log('3. Testing Get Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('User name:', profileResponse.data.name, '\n');

    // Test 4: Update user profile
    console.log('4. Testing Update Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/profile`, 
      { name: 'Updated Test User' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Profile updated successfully');
    console.log('Updated name:', updateResponse.data.name, '\n');

    // Test 5: Change password
    console.log('5. Testing Change Password...');
    const passwordResponse = await axios.post(`${BASE_URL}/change-password`, 
      {
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Password changed successfully:', passwordResponse.data.message, '\n');

    // Test 6: Login with new password
    console.log('6. Testing Login with New Password...');
    const newLoginResponse = await axios.post(`${BASE_URL}/login`, {
      phone_number: testUser.phone_number,
      password: 'newpassword123'
    });
    console.log('✅ Login with new password successful');
    authToken = newLoginResponse.data.token;
    console.log('New token received:', authToken.substring(0, 20) + '...\n');

    // Test 7: Logout
    console.log('7. Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Logout successful:', logoutResponse.data.message, '\n');

    console.log('🎉 All authentication tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth }; 
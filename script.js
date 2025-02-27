document.addEventListener('DOMContentLoaded', () => {
  // Get references to elements
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginSubmit = document.getElementById('login-submit');
  const registerSubmit = document.getElementById('register-submit');
  const appContent = document.getElementById('app-content');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutButton = document.getElementById('logout-button');

  const passengerDashboard = document.getElementById('passenger-dashboard');
  const driverDashboard = document.getElementById('driver-dashboard');
  const adminDashboard = document.getElementById('admin-dashboard');

  const bookCabButton = document.getElementById('book-cab');
  const bookingForm = document.getElementById('booking-form');
  const requestCabButton = document.getElementById('request-cab');
  const bookingStatus = document.getElementById('booking-status');

  const toggleAvailabilityButton = document.getElementById('toggle-availability');
  const driverStatusDisplay = document.getElementById('driver-status');

  const driverMapContainer = document.getElementById('driver-map-container');
  const rideRequestsContainer = document.getElementById('ride-requests');

  // State
  let currentUser = null;
  let driverAvailable = false;
  let fareRate = 15; // INR per kilometer
  let rideRequests = [];

  // Mock user data (replace with a real database in a real application)
  const users = [];

  // Functions

  function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  }

  function showRegisterForm() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  }

  function displayAppContent(user) {
    currentUser = user;
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    document.getElementById('auth-options').style.display = 'none'; // Hide login/register buttons
    appContent.style.display = 'block';
    welcomeMessage.textContent = `Welcome, ${user.username}! You are logged in as a ${user.role}.`;

    passengerDashboard.style.display = user.role === 'passenger' ? 'block' : 'none';
    driverDashboard.style.display = user.role === 'driver' ? 'block' : 'none';
    adminDashboard.style.display = user.role === 'admin' ? 'block' : 'none';

    // If it's a driver, initialize the driver dashboard
    if (user.role === 'driver') {
      initializeDriverDashboard();
    }
  }

  function logout() {
    currentUser = null;
    appContent.style.display = 'none';
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    document.getElementById('auth-options').style.display = 'block'; // Show login/register buttons
  }

  function calculateFare(pickup, dropoff) {
    // This is a placeholder; replace with actual distance calculation using a mapping service API.
    const distance = Math.floor(Math.random() * 20) + 1; // Random distance between 1 and 20 km
    const fare = distance * fareRate;
    return { distance, fare };
  }

  function addRideRequest(pickup, dropoff) {
    const {
      distance,
      fare
    } = calculateFare(pickup, dropoff);
    const requestId = Math.random().toString(36).substring(7); // Generate a random request ID
    const newRequest = {
      id: requestId,
      pickup,
      dropoff,
      distance,
      fare
    };
    rideRequests.push(newRequest);
    updateRideRequestsDisplay();
    return newRequest;
  }

  function updateRideRequestsDisplay() {
    rideRequestsContainer.innerHTML = '<h3>Ride Requests:</h3>';
    if (rideRequests.length === 0) {
      rideRequestsContainer.innerHTML += '<p>No ride requests at the moment.</p>';
      return;
    }

    rideRequests.forEach(request => {
      const requestDiv = document.createElement('div');
      requestDiv.classList.add('ride-request');
      requestDiv.innerHTML = `
            <p><strong>Pickup:</strong> ${request.pickup}</p>
            <p><strong>Dropoff:</strong> ${request.dropoff}</p>
            <p><strong>Distance:</strong> ${request.distance} km</p>
            <p><strong>Fare:</strong> ₹${request.fare}</p>
            <button class="accept-ride" data-id="${request.id}">Accept</button>
            <button class="reject-ride" data-id="${request.id}">Reject</button>
        `;
      rideRequestsContainer.appendChild(requestDiv);

      // Add event listeners to the accept and reject buttons
      const acceptButton = requestDiv.querySelector('.accept-ride');
      const rejectButton = requestDiv.querySelector('.reject-ride');

      acceptButton.addEventListener('click', () => {
        acceptRideRequest(request.id);
      });

      rejectButton.addEventListener('click', () => {
        rejectRideRequest(request.id);
      });
    });
  }

  function acceptRideRequest(requestId) {
    // Find the index of the ride request in the array
    const requestIndex = rideRequests.findIndex(request => request.id === requestId);

    if (requestIndex === -1) {
      console.log('Ride request not found.');
      return;
    }

    // Remove the accepted request from the array
    const acceptedRequest = rideRequests.splice(requestIndex, 1)[0];

    // Optionally, display a message to the driver
    alert(`Ride accepted: Pickup at ${acceptedRequest.pickup}, Dropoff at ${acceptedRequest.dropoff}`);

    // Update the ride requests display
    updateRideRequestsDisplay();
  }

  function rejectRideRequest(requestId) {
    // Find the index of the ride request in the array
    const requestIndex = rideRequests.findIndex(request => request.id === requestId);

    if (requestIndex === -1) {
      console.log('Ride request not found.');
      return;
    }

    // Remove the rejected request from the array
    rideRequests.splice(requestIndex, 1);

    // Optionally, display a message to the driver
    alert('Ride rejected.');

    // Update the ride requests display
    updateRideRequestsDisplay();
  }

  function initializeDriverDashboard() {
    // Initially, load and display any pending ride requests
    updateRideRequestsDisplay();
  }

  // Event Listeners

  loginButton.addEventListener('click', showLoginForm);
  registerButton.addEventListener('click', showRegisterForm);

  loginSubmit.addEventListener('click', () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      displayAppContent(user);
    } else {
      document.getElementById('login-error').textContent = 'Invalid username or password.';
    }
  });

  registerSubmit.addEventListener('click', () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    if (users.find(u => u.username === username)) {
      document.getElementById('register-error').textContent = 'Username already exists.';
      return;
    }

    const newUser = {
      username,
      password,
      role
    };
    users.push(newUser);
    displayAppContent(newUser);
  });

  logoutButton.addEventListener('click', logout);

  bookCabButton.addEventListener('click', () => {
    bookingForm.style.display = 'block';
  });

  requestCabButton.addEventListener('click', () => {
    const pickup = document.getElementById('pickup-location').value;
    const dropoff = document.getElementById('dropoff-location').value;

    const newRequest = addRideRequest(pickup, dropoff);

    bookingStatus.textContent = `Cab requested from ${pickup} to ${dropoff}. Distance: ${newRequest.distance} km. Estimated fare: ₹${newRequest.fare}. Waiting for driver...`;

    setTimeout(() => {
      bookingStatus.textContent = "No drivers available at this time.";
    }, 5000);
  });

  toggleAvailabilityButton.addEventListener('click', () => {
    driverAvailable = !driverAvailable;
    driverStatusDisplay.textContent = `Status: ${driverAvailable ? 'Available' : 'Unavailable'}`;
  });
});
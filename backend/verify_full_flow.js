const API_URL = 'http://localhost:5000/api';

async function verify() {
    console.log('Starting Verification...');

    const timestamp = Date.now();
    const adminEmail = `admin_${timestamp}@example.com`;
    const userEmail = `user_${timestamp}@example.com`;
    const password = 'password123';

    let adminToken = '';
    let userToken = '';
    let adminCookie = '';
    let userCookie = '';
    let jobId = '';
    let applicationId = '';

    // 1. Register Admin
    console.log('1. Registering Admin...');
    const registerAdminRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Admin', email: adminEmail, password, role: 'admin' })
    });
    const adminData = await registerAdminRes.json();
    if (!registerAdminRes.ok) throw new Error(`Admin Register Failed: ${JSON.stringify(adminData)}`);
    // Capture cookie manually if simplified, but fetch in node doesn't persist cookies automatically without a jar.
    // However, our backend uses `res.cookie` and `req.cookies`. Node's `fetch` doesn't handle cookies by default.
    // We need to extract `set-cookie` header and send it in subsequent requests.
    const adminSetCookie = registerAdminRes.headers.get('set-cookie');
    if (adminSetCookie) adminCookie = adminSetCookie.split(';')[0];
    console.log('Admin Registered:', adminData.email);

    // 2. Login Admin (to get cookie just in case, though signup logs in)
    // We already have the cookie from signup if successfully implemented.

    // 3. Create Job (as Admin)
    console.log('2. Creating Job...');
    const createJobRes = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': adminCookie
        },
        body: JSON.stringify({
            title: 'Software Engineer',
            description: 'Write code',
            skills: ['Node', 'React'],
            type: 'Job',
            location: 'Remote'
        })
    });
    const jobData = await createJobRes.json();
    if (!createJobRes.ok) throw new Error(`Create Job Failed: ${JSON.stringify(jobData)}`);
    jobId = jobData._id;
    console.log('Job Created:', jobId);

    // 4. Register User
    console.log('3. Registering User...');
    const registerUserRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'User', email: userEmail, password, role: 'user' })
    });
    const userData = await registerUserRes.json();
    if (!registerUserRes.ok) throw new Error(`User Register Failed: ${JSON.stringify(userData)}`);
    const userSetCookie = registerUserRes.headers.get('set-cookie');
    if (userSetCookie) userCookie = userSetCookie.split(';')[0];
    console.log('User Registered:', userData.email);

    // 5. Apply for Job (as User)
    console.log('4. Applying for Job...');
    const applyRes = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': userCookie
        },
        body: JSON.stringify({
            jobId,
            resumeLink: 'http://resume.com',
            coverNote: 'Hire me!'
        })
    });
    const applyData = await applyRes.json();
    if (!applyRes.ok) throw new Error(`Application Failed: ${JSON.stringify(applyData)}`);
    applicationId = applyData._id;
    console.log('Applied for Job:', applicationId);

    // 6. Get My Applications (as User)
    console.log('5. Verifying User Applications...');
    const myAppsRes = await fetch(`${API_URL}/applications/me`, {
        headers: { 'Cookie': userCookie }
    });
    const myApps = await myAppsRes.json();
    if (myApps.length !== 1) throw new Error('User should have 1 application');
    console.log('User sees application correctly.');

    // 7. Admin Update Status
    console.log('6. Admin Updating Status...');
    const updateRes = await fetch(`${API_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': adminCookie
        },
        body: JSON.stringify({ status: 'Shortlisted' })
    });
    const updateData = await updateRes.json();
    if (updateData.status !== 'Shortlisted') throw new Error('Status update failed');
    console.log('Status Updated to Shortlisted');

    // 8. Verify Status (as User)
    console.log('7. Verifying Status Update...');
    const myAppsRes2 = await fetch(`${API_URL}/applications/me`, {
        headers: { 'Cookie': userCookie }
    });
    const myApps2 = await myAppsRes2.json();
    if (myApps2[0].status !== 'Shortlisted') throw new Error('User does not see updated status');
    console.log('User sees updated status: Shortlisted');

    console.log('SUCCESS: Full flow verified!');
}

verify().catch(console.error);

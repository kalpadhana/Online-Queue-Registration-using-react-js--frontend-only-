# Test to verify emails go to correct user (not test@test.com)
$baseUrl = "http://localhost:8080"

Write-Host "[*] Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Signup User 1
Write-Host "`n[*] Testing Signup User 1..." -ForegroundColor Cyan
$signup1 = @{
    fullName = "User One"
    email = "user1@test.com"
    password = "Test@123"
    phone = "+94701111111"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/user" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $signup1 -ErrorAction Stop
    Write-Host "[OK] User 1 signup successful" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] User 1 signup failed: $_" -ForegroundColor Red
}

# Signup User 2
Write-Host "`n[*] Testing Signup User 2..." -ForegroundColor Cyan
$signup2 = @{
    fullName = "User Two"
    email = "user2@test.com"
    password = "Test@123"
    phone = "+94702222222"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/user" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $signup2 -ErrorAction Stop
    Write-Host "[OK] User 2 signup successful" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] User 2 signup failed: $_" -ForegroundColor Red
}

# Login User 1
Write-Host "`n[*] Testing Login User 1..." -ForegroundColor Cyan
$login1 = @{
    email = "user1@test.com"
    password = "Test@123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/user/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $login1 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    $token1 = $data.data.token
    $userId1 = $data.data.userId
    Write-Host "[OK] User 1 login: ID=$userId1, Email=$($data.data.email)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] User 1 login failed: $_" -ForegroundColor Red
    exit 1
}

# Login User 2
Write-Host "`n[*] Testing Login User 2..." -ForegroundColor Cyan
$login2 = @{
    email = "user2@test.com"
    password = "Test@123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/user/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $login2 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    $token2 = $data.data.token
    $userId2 = $data.data.userId
    Write-Host "[OK] User 2 login: ID=$userId2, Email=$($data.data.email)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] User 2 login failed: $_" -ForegroundColor Red
    exit 1
}

# User 1 joins queue
Write-Host "`n[*] User 1 ($userId1) joining queue..." -ForegroundColor Cyan
$join1 = @{
    userId = $userId1
    serviceId = 1
    branchId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/queues/join" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $token1"
        } `
        -Body $join1 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "[OK] User 1 joined queue: Token=$($data.data.token)" -ForegroundColor Green
    Write-Host "     >> Email should be sent to: user1@test.com" -ForegroundColor Yellow
} catch {
    Write-Host "[ERROR] User 1 join failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
}

# User 2 joins queue
Write-Host "`n[*] User 2 ($userId2) joining queue..." -ForegroundColor Cyan
$join2 = @{
    userId = $userId2
    serviceId = 2
    branchId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/queues/join" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $token2"
        } `
        -Body $join2 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "[OK] User 2 joined queue: Token=$($data.data.token)" -ForegroundColor Green
    Write-Host "     >> Email should be sent to: user2@test.com" -ForegroundColor Yellow
} catch {
    Write-Host "[ERROR] User 2 join failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
}

Write-Host "`n[*] Test Complete! Check console logs to verify correct emails were used" -ForegroundColor Cyan

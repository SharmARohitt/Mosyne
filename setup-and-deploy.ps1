# Quick Setup and Deploy Script
# This script will help you configure and deploy your contracts

Write-Host "`n🚀 MOSYNE Deployment Setup`n" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Check if .env.local exists
if (!(Test-Path .env.local)) {
    Write-Host "❌ .env.local not found!" -ForegroundColor Red
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
}

Write-Host "✅ .env.local file exists`n" -ForegroundColor Green

# Check current configuration
$envContent = Get-Content .env.local -Raw

# Check RPC URL
if ($envContent -match "YOUR_INFURA_KEY" -or $envContent -match "YOUR_KEY") {
    Write-Host "⚠️  RPC URL not configured!" -ForegroundColor Yellow
    Write-Host "`nYou need to set up your RPC URL. Choose an option:" -ForegroundColor Yellow
    Write-Host "1. Infura (https://infura.io)" -ForegroundColor White
    Write-Host "2. Alchemy (https://alchemy.com)" -ForegroundColor White
    Write-Host "3. QuickNode (https://quicknode.com)`n" -ForegroundColor White
    
    $rpcInput = Read-Host "Paste your Sepolia RPC URL (or press Enter to set up later)"
    
    if ($rpcInput) {
        $envContent = $envContent -replace "https://sepolia.infura.io/v3/YOUR_INFURA_KEY", $rpcInput
        $envContent = $envContent -replace "https://sepolia.infura.io/v3/YOUR_KEY", $rpcInput
        Set-Content .env.local $envContent
        Write-Host "✅ RPC URL updated!`n" -ForegroundColor Green
    } else {
        Write-Host "⏭️  Skipping RPC URL setup`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ RPC URL configured`n" -ForegroundColor Green
}

# Check Private Key
$envContent = Get-Content .env.local -Raw
if ($envContent -match "0xYOUR_PRIVATE_KEY_HERE") {
    Write-Host "⚠️  Private Key not configured!" -ForegroundColor Yellow
    Write-Host "`nTo get your private key from MetaMask:" -ForegroundColor Yellow
    Write-Host "1. Click the 3 dots next to your account" -ForegroundColor White
    Write-Host "2. Click 'Account Details'" -ForegroundColor White
    Write-Host "3. Click 'Show Private Key'" -ForegroundColor White
    Write-Host "4. Enter your password" -ForegroundColor White
    Write-Host "5. Copy the private key`n" -ForegroundColor White
    
    Write-Host "⚠️  WARNING: Never share your private key!`n" -ForegroundColor Red
    
    $pkInput = Read-Host "Paste your private key (or press Enter to set up later)" -AsSecureString
    
    if ($pkInput.Length -gt 0) {
        # Convert SecureString to plain text for file writing
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pkInput)
        $plainPK = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        if (!$plainPK.StartsWith("0x")) {
            $plainPK = "0x" + $plainPK
        }
        
        $envContent = $envContent -replace "PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE", "PRIVATE_KEY=$plainPK"
        Set-Content .env.local $envContent
        Write-Host "✅ Private key updated!`n" -ForegroundColor Green
        
        # Clear sensitive data
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    } else {
        Write-Host "⏭️  Skipping private key setup`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Private Key configured`n" -ForegroundColor Green
}

# Final check
$envContent = Get-Content .env.local -Raw
$rpcConfigured = !($envContent -match "YOUR_INFURA_KEY" -or $envContent -match "YOUR_KEY")
$pkConfigured = !($envContent -match "0xYOUR_PRIVATE_KEY_HERE")

Write-Host "`n==========================================`n" -ForegroundColor Cyan
Write-Host "Configuration Status:" -ForegroundColor Cyan
Write-Host "  RPC URL: $(if ($rpcConfigured) { '✅ Configured' } else { '❌ Not configured' })" -ForegroundColor $(if ($rpcConfigured) { 'Green' } else { 'Red' })
Write-Host "  Private Key: $(if ($pkConfigured) { '✅ Configured' } else { '❌ Not configured' })" -ForegroundColor $(if ($pkConfigured) { 'Green' } else { 'Red' })
Write-Host "`n==========================================`n" -ForegroundColor Cyan

if ($rpcConfigured -and $pkConfigured) {
    Write-Host "🎉 Configuration complete!`n" -ForegroundColor Green
    
    $deploy = Read-Host "Ready to deploy contracts to Sepolia? (y/n)"
    
    if ($deploy -eq "y" -or $deploy -eq "Y" -or $deploy -eq "yes") {
        Write-Host "`n🚀 Starting deployment...`n" -ForegroundColor Cyan
        
        # Check if node_modules exists
        if (!(Test-Path node_modules)) {
            Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
            npm install
        }
        
        # Check for Sepolia ETH
        Write-Host "`n⚠️  IMPORTANT: Make sure you have Sepolia ETH!`n" -ForegroundColor Yellow
        Write-Host "Get free Sepolia ETH from:" -ForegroundColor White
        Write-Host "  - https://sepoliafaucet.com" -ForegroundColor Cyan
        Write-Host "  - https://www.infura.io/faucet/sepolia" -ForegroundColor Cyan
        Write-Host "  - https://faucet.quicknode.com/ethereum/sepolia`n" -ForegroundColor Cyan
        
        $continue = Read-Host "I have Sepolia ETH and want to continue (y/n)"
        
        if ($continue -eq "y" -or $continue -eq "Y") {
            Write-Host "`n🔨 Compiling contracts..." -ForegroundColor Cyan
            npx hardhat compile
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n✅ Compilation successful!`n" -ForegroundColor Green
                Write-Host "🚀 Deploying to Sepolia...`n" -ForegroundColor Cyan
                npm run deploy:sepolia
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "`n🎉 Deployment successful!`n" -ForegroundColor Green
                    Write-Host "Next steps:" -ForegroundColor Cyan
                    Write-Host "1. Check deployment addresses in deployments/sepolia.json" -ForegroundColor White
                    Write-Host "2. Start dev server: npm run dev" -ForegroundColor White
                    Write-Host "3. Connect wallet at http://localhost:3000`n" -ForegroundColor White
                } else {
                    Write-Host "`n❌ Deployment failed! Check the error above.`n" -ForegroundColor Red
                }
            } else {
                Write-Host "`n❌ Compilation failed! Check the error above.`n" -ForegroundColor Red
            }
        } else {
            Write-Host "`n⏭️  Get Sepolia ETH first, then run: npm run deploy:sepolia`n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "`n⏭️  Skipping deployment. Run when ready: npm run deploy:sepolia`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Configuration incomplete!`n" -ForegroundColor Red
    Write-Host "Please update .env.local with:" -ForegroundColor Yellow
    if (!$rpcConfigured) {
        Write-Host "  - Your Sepolia RPC URL" -ForegroundColor White
    }
    if (!$pkConfigured) {
        Write-Host "  - Your wallet's private key" -ForegroundColor White
    }
    Write-Host "`nThen run this script again or run: npm run deploy:sepolia`n" -ForegroundColor Yellow
}

Write-Host "`nFor detailed help, see: deploy-helper.md`n" -ForegroundColor Cyan

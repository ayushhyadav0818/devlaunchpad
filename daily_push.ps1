# Daily Git Push Automator Script for DevLaunchpad
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$RepoPath = "C:\Users\acer\.gemini\antigravity-ide\scratch\dev-launchpad"

Write-Output "Running daily git push job at $(Get-Date)..."
if (Test-Path $RepoPath) {
    Set-Location $RepoPath
    git add .
    # Commit changes if any exist
    $status = git status --porcelain
    if ($status) {
        git commit -m "Daily automated commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        Write-Output "Successfully committed and pushed changes to GitHub."
    } else {
        Write-Output "No changes to commit today."
    }
} else {
    Write-Output "Repository path not found: $RepoPath"
}

@echo off
title VUO CSC HELP Localhost Server
echo ============================================================
echo Starting VUO CSC HELP Web Server at http://localhost:3000
echo ============================================================
start "" "http://localhost:3000"
powershell -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:3000/'); $listener.Start(); Write-Host 'Server running at http://localhost:3000 (Press Ctrl+C to stop)'; while ($listener.IsListening) { try { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $path = $req.Url.LocalPath.TrimStart('/'); if ([string]::IsNullOrEmpty($path) -or $path -eq '/') { $path = 'index.html' }; $file = Join-Path '%~dp0' $path; if (Test-Path $file -PathType Leaf) { $ext = [System.IO.Path]::GetExtension($file).ToLower(); $res.ContentType = switch($ext) { '.html' {'text/html'} '.css' {'text/css'} '.js' {'application/javascript'} '.svg' {'image/svg+xml'} '.png' {'image/png'} '.jpg' {'image/jpeg'} default {'application/octet-stream'} }; $bytes = [System.IO.File]::ReadAllBytes($file); $res.ContentLength64 = $bytes.Length; $res.StatusCode = 200; $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $res.StatusCode = 404 }; $res.Close() } catch {} }"
pause

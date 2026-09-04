$target = Invoke-RestMethod -Method Put -Uri 'http://127.0.0.1:9223/json/new?https://localhost:56732/pages/cookie-declaration'
Start-Sleep -Seconds 3
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.Options.Proxy = $null
$ws.Options.SetRequestHeader('Origin', 'http://localhost:9223')
[void]$ws.ConnectAsync([Uri]::new([string]$target.webSocketDebuggerUrl), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$bytes = [Text.Encoding]::UTF8.GetBytes('{"id":1,"method":"Runtime.evaluate","params":{"expression":"(async()=>{await new Promise(r=>setTimeout(r,6000));let root=document.querySelector(\"#CookieDeclaration\");let lines=(document.body?.innerText||\"\").split(/\\n+/).map(x=>x.trim()).filter(Boolean);let index=lines.findIndex(x=>/unclassified/i.test(x));return JSON.stringify({url:location.href,title:document.title,root:!!root,unclassifiedLines:index>=0?lines.slice(index,index+14):[],bodyMatches:lines.filter(x=>/unclassified|necessary|preference|statistics|marketing/i.test(x)).slice(0,100),scripts:[...document.scripts].filter(s=>s.id===\"CookieDeclaration\").map(s=>s.src)})})()","returnByValue":true,"awaitPromise":true}}')
[void]$ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$memory = New-Object IO.MemoryStream
do {
    $buffer = New-Object byte[] 65536
    $result = $ws.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    if ($result.Count -gt 0) { $memory.Write($buffer, 0, $result.Count) }
} while (-not $result.EndOfMessage)
[Text.Encoding]::UTF8.GetString($memory.ToArray())
$ws.Dispose()

$target = Invoke-RestMethod -Method Put -Uri 'http://127.0.0.1:9223/json/new?https://localhost:56732/hi-vac-valves-exposed-o-ring-ptfe-plug'
Start-Sleep -Seconds 3
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.Options.Proxy = $null
$ws.Options.SetRequestHeader('Origin', 'http://localhost:9223')
[void]$ws.ConnectAsync([Uri]::new([string]$target.webSocketDebuggerUrl), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$bytes = [Text.Encoding]::UTF8.GetBytes('{"id":1,"method":"Runtime.evaluate","params":{"expression":"(async()=>{await new Promise(r=>setTimeout(r,4000));return JSON.stringify({url:location.href,title:document.title,marketingScripts:[...document.querySelectorAll(\"script[data-cookieconsent=marketing]\")].map(s=>({type:s.type,src:s.src,text:s.textContent.slice(0,100)})),liveText:(document.body?.innerText||\"\").includes(\"LiveChat\"),liveSource:(document.documentElement?.innerHTML||\"\").includes(\"livechatinc\"),liveWidget:typeof window.LiveChatWidget})})()","returnByValue":true,"awaitPromise":true}}')
[void]$ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$memory = New-Object IO.MemoryStream
do {
    $buffer = New-Object byte[] 65536
    $result = $ws.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    if ($result.Count -gt 0) { $memory.Write($buffer, 0, $result.Count) }
} while (-not $result.EndOfMessage)
[Text.Encoding]::UTF8.GetString($memory.ToArray())
$ws.Dispose()

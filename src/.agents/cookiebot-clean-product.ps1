$target = Invoke-RestMethod -Method Put -Uri 'http://127.0.0.1:9223/json/new?https://localhost:56732/hi-vac-valves-exposed-o-ring-ptfe-plug'
Start-Sleep -Seconds 3
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.Options.Proxy = $null
$ws.Options.SetRequestHeader('Origin', 'http://localhost:9223')
[void]$ws.ConnectAsync([Uri]::new([string]$target.webSocketDebuggerUrl), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$script:id = 0
function Send-Cdp([string]$method, [object]$params) {
    $script:id++
    $request = @{ id = $script:id; method = $method; params = $params }
    $bytes = [Text.Encoding]::UTF8.GetBytes(($request | ConvertTo-Json -Compress -Depth 20))
    [void]$ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    return $script:id
}
function Receive-Cdp { do { $buffer = New-Object byte[] 65536; $result = $ws.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult(); $text = [Text.Encoding]::UTF8.GetString($buffer, 0, $result.Count) } while (-not $result.EndOfMessage); return $text | ConvertFrom-Json }
function Wait-Cdp([int]$id) { while ($true) { $message = Receive-Cdp; if ($message.id -eq $id) { return $message } } }
function Evaluate-Cdp([string]$expression, [bool]$awaitPromise = $false) { $id = Send-Cdp 'Runtime.evaluate' @{ expression = $expression; returnByValue = $true; awaitPromise = $awaitPromise }; return (Wait-Cdp $id).result.result.value }
[void](Wait-Cdp (Send-Cdp 'Network.enable' @{})); [void](Wait-Cdp (Send-Cdp 'Runtime.enable' @{})); [void](Wait-Cdp (Send-Cdp 'Page.enable' @{})); [void](Wait-Cdp (Send-Cdp 'Network.clearBrowserCookies' @{})); [void](Wait-Cdp (Send-Cdp 'Network.clearBrowserCache' @{})); [void](Wait-Cdp (Send-Cdp 'Storage.clearDataForOrigin' @{ origin = 'https://localhost:56732'; storageTypes = 'all' })); [void](Wait-Cdp (Send-Cdp 'Page.reload' @{ ignoreCache = $true })); $state = Evaluate-Cdp "(async()=>{await new Promise(r=>setTimeout(r,5000));return JSON.stringify({cookie:document.cookie,consent:Cookiebot?.consent,googleScripts:[...document.scripts].map(s=>s.src).filter(x=>x.includes('google')),live:typeof LiveChatWidget})})()" $true; $state; $ws.Dispose()

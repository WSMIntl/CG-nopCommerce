$target = $null
$targets = (Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:9223/json/list').Content | ConvertFrom-Json
foreach ($item in $targets) {
    if ([string]$item.type -eq 'page' -and [string]$item.url -like 'https://localhost:56732/*') {
        $target = $item
        break
    }
}
if ($null -eq $target) {
    $target = Invoke-RestMethod -Method Put -Uri 'http://127.0.0.1:9223/json/new?https://localhost:56732/'
}

$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.Options.Proxy = $null
$ws.Options.SetRequestHeader('Origin', 'http://localhost:9223')
[void]$ws.ConnectAsync([Uri]::new([string]$target.webSocketDebuggerUrl), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$script:messageId = 0
$script:events = @()

function Send-Cdp([string]$method, [object]$params) {
    $script:messageId++
    $request = @{ id = $script:messageId; method = $method; params = $params }
    $bytes = [Text.Encoding]::UTF8.GetBytes(($request | ConvertTo-Json -Compress -Depth 20))
    [void]$ws.SendAsync([ArraySegment[byte]]::new($bytes), [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    return $script:messageId
}

function Receive-CdpMessage {
    $memory = New-Object IO.MemoryStream
    do {
        $buffer = New-Object byte[] 65536
        $result = $ws.ReceiveAsync([ArraySegment[byte]]::new($buffer), [Threading.CancellationToken]::None).GetAwaiter().GetResult()
        if ($result.Count -gt 0) { $memory.Write($buffer, 0, $result.Count) }
    } while (-not $result.EndOfMessage)
    return [Text.Encoding]::UTF8.GetString($memory.ToArray()) | ConvertFrom-Json
}

function Wait-CdpResponse([int]$id) {
    while ($true) {
        $message = Receive-CdpMessage
        if ($message.method) { $script:events += $message }
        if ($message.id -eq $id) { return $message }
    }
}

function Evaluate-Cdp([string]$expression, [bool]$awaitPromise = $false) {
    $id = Send-Cdp 'Runtime.evaluate' @{ expression = $expression; returnByValue = $true; awaitPromise = $awaitPromise }
    $response = Wait-CdpResponse $id
    if ($response.result.exceptionDetails) {
        return @{ error = ($response.result.exceptionDetails | ConvertTo-Json -Compress -Depth 8) }
    }
    return $response.result.result.value
}

function Get-PageState([int]$waitMilliseconds) {
    $expression = "(async()=>{await new Promise(r=>setTimeout(r,$waitMilliseconds));let d=document.querySelector('#CybotCookiebotDialog');let c=window.Cookiebot?.consent;return JSON.stringify({url:location.href,title:document.title,banner:!!d&&getComputedStyle(d).display!=='none',consent:c?{necessary:c.necessary,preferences:c.preferences,statistics:c.statistics,marketing:c.marketing,method:c.method}:null,scripts:[...document.scripts].filter(s=>s.src&&/google|icontact|livechat|facebook|doubleclick|brevo|omnisend|klaviyo/i.test(s.src)).map(s=>({host:new URL(s.src).host,type:s.type,cc:s.dataset.cookieconsent})),cookies:document.cookie.split(';').map(x=>x.trim().split('=')[0]).filter(Boolean)})})()"
    return (Evaluate-Cdp $expression $true) | ConvertFrom-Json
}

[void](Wait-CdpResponse (Send-Cdp 'Network.enable' @{}))
[void](Wait-CdpResponse (Send-Cdp 'Page.enable' @{}))
[void](Wait-CdpResponse (Send-Cdp 'Runtime.enable' @{}))

$pages = [ordered]@{
    home = '/'
    product = '/hi-vac-valves-exposed-o-ring-ptfe-plug'
    newsletter = '/pages/signupform'
    sampleForm = '/pages/vials-sample-pack-form'
}
$modes = @('none', 'decline', 'statistics', 'marketing', 'all')
$rows = @()

foreach ($pageName in $pages.Keys) {
    foreach ($mode in $modes) {
        [void](Wait-CdpResponse (Send-Cdp 'Network.clearBrowserCookies' @{}))
        [void](Wait-CdpResponse (Send-Cdp 'Network.clearBrowserCache' @{}))
        $script:events = @()
        [void](Wait-CdpResponse (Send-Cdp 'Page.navigate' @{ url = "https://localhost:56732$($pages[$pageName])" }))
        $state = Get-PageState 1200

        if ($mode -eq 'decline') {
            [void](Evaluate-Cdp "(()=>{document.querySelector('#CybotCookiebotDialogBodyButtonDecline')?.click();return true})()")
        }
        elseif ($mode -eq 'statistics') {
            [void](Evaluate-Cdp "(()=>{Cookiebot.submitCustomConsent(false,true,false);return true})()")
        }
        elseif ($mode -eq 'marketing') {
            [void](Evaluate-Cdp "(()=>{Cookiebot.submitCustomConsent(false,false,true);return true})()")
        }
        elseif ($mode -eq 'all') {
            [void](Evaluate-Cdp "(()=>{document.querySelector('#CybotCookiebotDialogBodyButtonAccept')?.click();return true})()")
        }

        if ($mode -ne 'none') { $state = Get-PageState 1800 }
        $urls = @($script:events | Where-Object { $_.method -eq 'Network.requestWillBeSent' } | ForEach-Object { $_.params.request.url } | Where-Object { $_ -notmatch '^https://localhost' -and $_ -notmatch '^https://consent' })
        $hosts = @($urls | ForEach-Object { try { [Uri]::new($_).Host } catch {} } | Where-Object { $_ } | Select-Object -Unique)
        $rows += [ordered]@{
            page = $pageName
            mode = $mode
            banner = $state.banner
            consent = $state.consent
            scriptHosts = @($state.scripts | ForEach-Object { $_.host } | Select-Object -Unique)
            requestHosts = $hosts
            cookieNames = @($state.cookies)
        }
    }
}

$rows | ConvertTo-Json -Depth 20
$ws.Dispose()

param(
    [Parameter(Mandatory = $true)][string]$Manifest,
    [Parameter(Mandatory = $true)][string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType=WindowsRuntime]
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesisStream, Windows.Media.SpeechSynthesis, ContentType=WindowsRuntime]
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
} | Select-Object -First 1
$awaitSpeech = $asTask.MakeGenericMethod([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
try {
    $voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices |
        Where-Object { $_.Language -like 'de-*' }
    $preferred = $voices | Where-Object { $_.DisplayName -eq 'Microsoft Katja' } | Select-Object -First 1
    if (-not $preferred) { $preferred = $voices | Select-Object -First 1 }
    if (-not $preferred) { throw 'Keine lokale deutsche Windows-Stimme gefunden.' }
    $synth.Voice = $preferred
    $synth.Options.SpeakingRate = 0.96
    Write-Output $preferred.DisplayName

    $lines = Get-Content -LiteralPath $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($line in $lines) {
        $pending = $synth.SynthesizeTextToStreamAsync($line.spoken)
        $task = $awaitSpeech.Invoke($null, @($pending))
        $stream = $task.GetAwaiter().GetResult()
        try {
            $waveInput = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
            $file = [System.IO.File]::Create((Join-Path $OutputDirectory ($line.id + '.wav')))
            try {
                $waveInput.CopyTo($file)
            } finally {
                $file.Dispose()
                $waveInput.Dispose()
            }
        } finally {
            $stream.Dispose()
        }
    }
} finally {
    $synth.Dispose()
}

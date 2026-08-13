$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "썰쟁 Studio - 렌더 모드 선택"
$form.Size = New-Object System.Drawing.Size(430,245)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.MinimizeBox = $false
$form.TopMost = $true

$title = New-Object System.Windows.Forms.Label
$title.Text = "렌더 모드를 선택하세요"
$title.Font = New-Object System.Drawing.Font("Malgun Gothic",14,[System.Drawing.FontStyle]::Bold)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(90,25)
$form.Controls.Add($title)

$desc = New-Object System.Windows.Forms.Label
$desc.Text = "TURBO: 빠른 출력 (24fps)    FAST: 안정 출력 (30fps)"
$desc.Font = New-Object System.Drawing.Font("Malgun Gothic",9)
$desc.AutoSize = $true
$desc.Location = New-Object System.Drawing.Point(55,65)
$form.Controls.Add($desc)

$turbo = New-Object System.Windows.Forms.Button
$turbo.Text = "TURBO 고속"
$turbo.Font = New-Object System.Drawing.Font("Malgun Gothic",11,[System.Drawing.FontStyle]::Bold)
$turbo.Size = New-Object System.Drawing.Size(150,55)
$turbo.Location = New-Object System.Drawing.Point(45,105)
$turbo.Add_Click({ $form.Tag="TURBO"; $form.Close() })
$form.Controls.Add($turbo)

$fastBtn = New-Object System.Windows.Forms.Button
$fastBtn.Text = "FAST 안정"
$fastBtn.Font = New-Object System.Drawing.Font("Malgun Gothic",11,[System.Drawing.FontStyle]::Bold)
$fastBtn.Size = New-Object System.Drawing.Size(150,55)
$fastBtn.Location = New-Object System.Drawing.Point(220,105)
$fastBtn.Add_Click({ $form.Tag="FAST"; $form.Close() })
$form.Controls.Add($fastBtn)

[void]$form.ShowDialog()

if (-not $form.Tag) { exit 2 }
Write-Output $form.Tag

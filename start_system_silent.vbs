Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """" & Replace(WScript.ScriptFullName, WScript.ScriptName, "") & "start_system.bat""", 0, False

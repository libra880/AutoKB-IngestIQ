@"
## Case Metadata
**Title**: Example Case
**Product**: Defender for Identity
**Environment**: Hybrid AD
**Severity**: High

## Issue Description
User reports missing alerts for lateral movement detection.

## Troubleshooting Steps
- Verified sensor connectivity
- Checked exclusion logic
- Reviewed alert policy configuration

## Resolution
Updated alert policy to include lateral movement detection. Rebooted sensor.

## Tags
[ ] defender-for-identity
[ ] alert-policy
[ ] lateral-movement
"@ | Out-File .\docs\example.md -Encoding UTF8
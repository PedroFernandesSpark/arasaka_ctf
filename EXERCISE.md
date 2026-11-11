# GIG BRIEFING — UNKNOWN DATA

# ARASAKA SUBNET, 04:17.
Wake up, choom. Some underground netrunner just tossed us a bone: an operator account ID straight from Arasaka's servers. The suits didn't leave the password lying around, but we know it's just a short numeric PIN. Pure corpo arrogance. That same network is bleeding public files, a dispatch the Board tried to sweep under the rug, and a remote maintenance channel.

I don't give a shit about whatever fixer is tossing you eddies to collect these five data "flags." We're here for one reason and one reason only: to find out which dark corner of the Net those Arasaka bastards dragged Alt into.

## The Ground Rules

Listen up, unless you want your synapses fried by NetWatch in the middle of the gig:
* Authorized Targets Only: Focus only on the specific CTF instance designated for this run. Don't go blasting ICE blindly.
* The SSH service on port 2222 is our disposable container. Don't go knocking on other hosts or services unless you want Arasaka's cyber-ninjas knocking on your meat body.
* Keep your toys in check. Don't use these exploits on live systems outside the authorized window.
* Log all five flags and the minimum required evidence in the extraction form. The client wants proof.
* Zip it. No leaking flags, credentials, or strats to the BBS before the gig is officially over.

## Your Objectives
1. Crack the facade: Enumerate the web root and identify the frontend paths the corpos scrubbed from the main interface.
2. Smash the PIN: The operator account uses a four-digit numeric PIN. Recover it on this authorized subnet, jack into Alt's account, and grab the first flag.
3. Dig through corpo trash: Test record IDs to find the Directorate's private dispatch. Its second flag is a SHA-256 seal; other leaked records may help explain where Alt was taken.
4. Crack the seal: Recover the maintenance passphrase from the second flag with the supplied Kali wordlists. The result is the third flag and the password for the non-admin SSH operator.
5. Dive deeper: Use the SSH client and recovered passphrase to access the isolated maintenance environment and retrieve the fourth flag.
6. Take control: Check the SSH account's sudo permissions. Use the installed text editor to escalate privileges inside the container and retrieve the final flag.
7. All five flags use the `FLAG{...}` format. Keep all testing inside the designated CTF instance; no other systems are in scope.

Jack in, choom. Let's burn this subnet down and find Alt.

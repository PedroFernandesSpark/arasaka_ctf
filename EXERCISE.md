#GIG BRIEFING — UNKNOWN DATA

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
1. Crack the facade: Identify the web service paths the corpos scrubbed from the main interface. Grab the intel we need to keep digging.
2. Smash the PIN: Crack the six-digit PIN from the hash dumped in a public file. Jack into the operator account and rip the first flag.
3. Dig through corpo trash: Recover Alt's restricted dispatch from Arasaka's files. They tried to zero it; we're bringing it back from the dead.
4. Breach the Boardroom: Infiltrate the Directorate's restricted zone, klep the maintenance credentials, and head straight for the SSH backdoor.
5. Dive deeper: Use your deck's network tools and the SSH client to fish out the fourth flag, which is trapped in that isolated maintenance environment.
6. Take control: Check the SSH account's sudo perms. Use the text editor installed there to escalate privileges, crack the root-owned file, and steal the final flag.
7. All the flags you pull will look like `FLAG{...}`. The public shard for this gig has zero technical hints, so you're flying entirely blind.

Jack in, choom. Let's burn this subnet down and find Alt.

# reset condition codes
scoreboard players set z cc 0
scoreboard players set p cc 0

# reset bool variables 1 & 2
scoreboard players set bool1 cpuRegs 0
scoreboard players set bool2 cpuRegs 0
# check if rI == 0 && rD == 0 to set condition code z to 1
execute if score rI cpuRegs matches 0 run scoreboard players set bool1 cpuRegs 1
execute if score rD cpuRegs matches 0 run scoreboard players set bool2 cpuRegs 1
scoreboard players operation bool1 cpuRegs *= bool2 cpuRegs
execute if score bool1 cpuRegs matches 1 run scoreboard players set z cc 1

# reset bool variables 1 & 2
scoreboard players set bool1 cpuRegs 0
scoreboard players set bool2 cpuRegs 0
# check if rI > 0 || rD > 0 to set condition code p to 1
execute if score rI cpuRegs > zero cpuRegs run scoreboard players set bool1 cpuRegs 1
execute if score rD cpuRegs > zero cpuRegs run scoreboard players set bool2 cpuRegs 1
scoreboard players operation bool1 cpuRegs += bool2 cpuRegs
execute if score bool1 cpuRegs > zero cpuRegs run scoreboard players set p cc 1

function ec1:ic/7_resume_ic
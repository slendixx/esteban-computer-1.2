# Find a way to implement call stack overflow test
# execute if score callStackPtr cpuRegs = callStackLimit cpuRegs
scoreboard players reset bool1 cpuRegs

execute if score callStackPtr cpuRegs >= callStackLimit cpuRegs run scoreboard players add bool1 cpuRegs 1

# A call stack overflow was produced
execute if score bool1 cpuRegs matches 1 run function ec1:errors/call_stack_overflow

# If there was no stack overflow error, continue with call execution
execute if score bool1 cpuRegs matches 0 run function ec1:is/branch/call/2_pc_to_mbr2

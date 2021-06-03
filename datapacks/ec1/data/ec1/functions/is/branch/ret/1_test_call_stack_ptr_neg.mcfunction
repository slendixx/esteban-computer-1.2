scoreboard players reset bool1 cpuRegs

execute if score callStackPtr cpuRegs matches 0 run scoreboard players set bool1 cpuRegs 1

execute if score bool1 cpuRegs matches 1 run function ec1:errors/call_stack_ptr_neg
execute if score bool1 cpuRegs matches 0 run function ec1:is/branch/ret/2_decrease_call_stack_ptr
# Data Transfer
execute if score ir1 cpuRegs matches 110 run function ec1:is/dt/ld1/1_ir2_to_op1
execute if score ir1 cpuRegs matches 111 run function ec1:is/dt/ld1i/1_ir2_to_mar
execute if score ir1 cpuRegs matches 120 run function ec1:is/dt/ld2/1_ir2_to_op2
execute if score ir1 cpuRegs matches 121 run function ec1:is/dt/ld2i/1_ir2_to_mar
execute if score ir1 cpuRegs matches 130 run function ec1:is/dt/st/1_r_to_mbr

# Arithmetic
execute if score ir1 cpuRegs matches 200 run function ec1:is/arith/add/1_op1_to_r 
execute if score ir1 cpuRegs matches 201 run function ec1:is/arith/addcc/1_op1_to_r
execute if score ir1 cpuRegs matches 210 run function ec1:is/arith/sub/1_op1_to_r
execute if score ir1 cpuRegs matches 211 run function ec1:is/arith/subcc/1_op1_to_r
execute if score ir1 cpuRegs matches 220 run function ec1:is/arith/mul/1_op1_to_r
execute if score ir1 cpuRegs matches 221 run function ec1:is/arith/mulcc/1_op1_to_r
execute if score ir1 cpuRegs matches 230 run function ec1:is/arith/div/1_op1_to_r
execute if score ir1 cpuRegs matches 231 run function ec1:is/arith/divcc/1_op1_to_r
execute if score ir1 cpuRegs matches 240 run function ec1:is/arith/mod/1_op1_to_r
execute if score ir1 cpuRegs matches 241 run function ec1:is/arith/modcc/1_op1_to_r

# Branch
execute if score ir1 cpuRegs matches 320 run function ec1:is/branch/bu/1_ir2_to_pc_inc
execute if score ir1 cpuRegs matches 300 run function ec1:is/branch/bz/1_test_for_cc_z
execute if score ir1 cpuRegs matches 301 run function ec1:is/branch/bpos/1_test_for_cc_p
execute if score ir1 cpuRegs matches 311 run function ec1:is/branch/bneg/1_not_test_for_cc_p
execute if score ir1 cpuRegs matches 330 run function ec1:is/branch/call/1_test_call_stack_overflow
execute if score ir1 cpuRegs matches 331 run function ec1:is/branch/ret/1_test_call_stack_ptr_neg

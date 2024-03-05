import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SplitBill } from '../wrappers/SplitBill';
import '@ton/test-utils';

describe('SplitBill', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let splitBill: SandboxContract<SplitBill>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        splitBill = blockchain.openContract(await SplitBill.fromInit(1000n));

        deployer = await blockchain.treasury('deployer');
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and splitBill are ready to use
        const deployResult = await splitBill.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const senderBalance = await deployer.getBalance();

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: splitBill.address,
            deploy: true,
            success: true,
        });
    });

    it('Should sent 99.9% TON coint  back to the sender', async () => {
        await splitBill.send(deployer.getSender(), {
            value: toNano("5")
        }, null);

        const senderBalance = await deployer.getBalance();

        expect(senderBalance.toString().substring(0, 3)).toEqual('999');
    });
});

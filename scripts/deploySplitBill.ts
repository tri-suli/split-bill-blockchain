import { toNano } from '@ton/core';
import { SplitBill } from '../wrappers/SplitBill';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const splitBill = provider.open(await SplitBill.fromInit(54325n));

    await splitBill.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(splitBill.address);

    // run methods on `splitBill`
}

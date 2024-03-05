import "@stdlib/deploy";

contract SplitBill with Deployable {
    id: Int as uint32;
    receiver: Address;
    refundAmount: Int as uint128;
    forwardAmount: Int as uint128;

    init(id: Int) {
        self.id = id;
        self.receiver = address("UQCfu4NxQ4kKtNRgK6aZPZkzxijDGcjfJYw1dEDBb0VkmwN5");
        self.refundAmount = 0;
        self.forwardAmount = 0;
    }

    receive() {
        require(context().value > 0, "Invalid amount");

        // Calculate the refund amount (99.9%)
        self.refundAmount = (context().value * 999) / 1000;

        // Calculate the amount to forward to the fixed address (0.1%)
        self.forwardAmount = context().value - self.refundAmount;

        // Refund 99.9% back to the sender
        send(SendParameters {
            to: sender(),
            bounce: true,
            value: self.refundAmount
        });

        // Forward 0.1% to the fixed address
        send(SendParameters {
            to: self.receiver,
            bounce: true,
            value: self.forwardAmount
        });
    }

    get fun forwardAmount(): Int {
        return self.forwardAmount;
    }

    get fun id(): Int {
        return self.id;
    }
}

//TODO: Please write code in this file.
var outputText;
var itemCount;
var listSeperator;
var endMark;
var marketName;
var promotionSentence;
var billHeader;

function printInventory(inputs) {
	setSources();
	outputText += billHeader;
	scanItems(inputs);
	printMainBill();
	outputText += listSeperator;
	printPromotion();
	outputText += listSeperator;
	printTotalCount();
	outputText += endMark;

    return outputText;
}

function setSources() {
	marketName = "没钱赚商店";
	billHeader = "***<"+marketName+">购物清单***\n"
	listSeperator = "----------------------\n";
	endMark = "**********************\n";
	promotionSentence = "挥泪赠送商品：\n";
}

function barcodeLegal() {
	
}
function printMainBill() {

}
function printPromotion() {
	outputText += promotionSentence;
	for (item in itemCount) {

	}
}
function printTotalCount() {}

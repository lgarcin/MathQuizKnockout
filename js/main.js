MathJax.Hub.Config({
	tex2jax : {
		inlineMath : [['$', '$'], ['\\[', '\\]']]
	},
	"HTML-CSS" : {
		scale : 110
	},
	TeX : {
		Macros : {
			"dC" : "{\\mathbb{C}}",
			"dN" : "{\\mathbb{N}}",
			"dR" : "{\\mathbb{R}}",
			"dZ" : "{\\mathbb{Z}}",
			"cB" : "{\\mathcal{B}}",
			"cC" : "{\\mathcal{C}}",
			"cL" : "{\\mathcal{L}}",
			"cM" : "{\\mathcal{M}}",
			"cS" : "{\\mathcal{S}}",
			"Ker" : "{\\mathop{Ker}}",
			"Im" : "{\\mathop{Im}}",
			"re" : "{\\mathfrak{Re}}",
			"im" : "{\\mathfrak{Im}}",
			"syst" : ["\\left\\{\\begin{aligned}#1\\end{aligned}\\right.", 1],
			"vect" : "{\\mathop{vect}}",
			"la" : "{\\lambda}",
			"te" : "{\\theta}",
			"trans" : ["{}^t#1", 1],
			"tr" : "{\\mathop{Tr}}",
			"O" : "{\\DeclareMathOperator{O}}",
			"rg" : "{\\DeclareMathOperator{rg}}",
			"sp" : "{\\DeclareMathOperator{sp}}",
			"iddots" : "{\\kern3mu\\raise1mu{.}\\kern3mu\\raise6mu{.}\\kern3mu\\raise12mu{.}}",
			"al" : "{\\alpha}"
		}

	}
});
MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
	var TEX = MathJax.InputJax.TeX;
	var PREFILTER = TEX.prefilterMath;
	TEX.Augment({
		prefilterMath : function(math, displaymode, script) {
			math = "\\displaystyle{" + math + "}";
			return PREFILTER.call(TEX, math, displaymode, script);
		}
	});
});

function Item() {
	var self = this;
	self.enonce = ko.observable();
	self.reponses = ko.observableArray();
	self.load = function(file) {
		$.ajax({
			dataType : 'xml',
			url : file,
			success : function(xml) {
				self.enonce($(xml).find("enonce").text());
				self.reponses([]);
				$(xml).find("reponse").each(function() {
					self.reponses.push({
						reponse : $(this).text(),
						value : $(this).attr('value') === "true",
						userValue : ko.observable(false)
					});
				})
			}
		})
	}
	self.score = ko.computed(function() {
		var s = 0;
		for (var i in self.reponses()) {
			var reponse = self.reponses()[i];
			if (reponse.value === reponse.userValue()) {
				s++;
			}
		}
		return s;
	}, self);
}

function QuizModel() {
	var self = this;
	self.fileList = ['Exercices/Exo001.xml', 'Exercices/Exo002.xml', 'Exercices/Exo003.xml', 'Exercices/Exo004.xml', 'Exercices/Exo005.xml', 'Exercices/Exo006.xml', 'Exercices/Exo007.xml'];
	self.itemList = [];
	for (var i in self.fileList) {
		var item = new Item();
		item.load(self.fileList[i]);
		self.itemList.push(item);
	}
	self.index = ko.observable();
	location.hash = '0';
	self.previous = function() {
		idx = self.index() - 1;
		location.hash = idx.toString();
	};
	self.next = function() {
		idx = self.index() + 1;
		location.hash = idx.toString();
	};
	self.score = ko.computed(function() {
		var s = 0;
		for (var i in self.itemList) {
			s += self.itemList[i].score();
		}
		return s;
	}, self)
	Sammy(function() {
		this.get('#:index', function() {
			self.index(parseInt(this.params.index));
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		});
	}).run();
}

/*
 function QuizModel() {
 var self = this;
 self.fileList = ['Exercices/Exo001.xml', 'Exercices/Exo002.xml', 'Exercices/Exo003.xml', 'Exercices/Exo004.xml', 'Exercices/Exo005.xml', 'Exercices/Exo006.xml', 'Exercices/Exo007.xml'];
 self.itemList = [];
 for (var i in self.fileList) {
 var item = new Item();
 item.load(self.fileList[i]);
 self.itemList.push(item);
 }
 self.index = ko.observable(0);
 self.previous = function() {
 self.index(self.index() - 1)
 MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 };
 self.next = function() {
 self.index(self.index() + 1)
 MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
 };
 self.score = ko.computed(function() {
 var s = 0;
 for (var i in self.itemList) {
 s += self.itemList[i].score();
 }
 return s;
 }, self)
 }
 */

ko.applyBindings(new QuizModel());

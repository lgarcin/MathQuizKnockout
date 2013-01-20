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
			"O" : "{\\mathrm{O}}",
			"rg" : "{\\mathrm{rg}}",
			"sp" : "{\\mathrm{sp}}",
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

$('#choice').click(function() {
	$('#choiceModal').modal('hide');
});

$('#results').click(function() {
	$('#resultsModal').modal('hide');
});

function Item() {
	var self = this;
	self.enonce = ko.observable();
	self.reponses = ko.observableArray();
	self.loadXml = function(xml) {
		self.enonce($(xml).find("enonce").text());
		self.reponses([]);
		$(xml).find("reponse").each(function() {
			self.reponses.push({
				reponse : $(this).text(),
				value : $(this).attr('value') === "true",
				userValue : ko.observable(false)
			})
		})
	};

	self.score = ko.computed(function() {
		var s = 1;
		for (var i in self.reponses()) {
			var reponse = self.reponses()[i];
			if (reponse.value != reponse.userValue()) {
				s = 0;
			}
		}
		return s;
	}, self);
}

function QuizModel() {
	var self = this;
	self.itemList = ko.observableArray();
	self.index = ko.observable();
	self.number = ko.observable(20);
	self.niveau = ko.observable("Tout le programme");
	self.themes = ko.observableArray();
	self.selectedThemes = ko.observableArray();
	self.view = ko.observable('choice');
	self.range = ko.observableArray();

	location.hash = 'choice';

	$.getJSON('themes.php', function(themes) {
		$.each(themes, function(key, val) {
			self.themes.push(ko.observable(val[0]));
		});
	});

	self.choice = function() {
		self.range.removeAll();
		for (var i = 1; i <= self.number(); i++) {
			self.range.push(i);
		}
		$.get('choice.php', {
			number : self.number(),
			niveau : self.niveau()
		}, function(xml) {
			$(xml).find("exo").each(function() {
				var item = new Item();
				item.loadXml(this);
				self.itemList.push(item);
			});
			location.hash = '1';
		}, 'xml');
	};

	self.score = ko.computed(function() {
		var s = 0;
		for (var i in self.itemList()) {
			s += self.itemList()[i].score();
		}
		return s;
	}, self);

	self.percentage = ko.computed(function() {
		return self.score() / self.number() * 100;
	}, self);

	self.results = ko.computed(function() {
		if (self.percentage() > 75) {
			return {
				score : self.score(),
				percentage : self.percentage(),
				smiley : "img/level1.png",
				comment : "Tout baigne !"
			};
		} else if (self.percentage() > 50) {
			return {
				score : self.score(),
				percentage : self.percentage(),
				smiley : "img/level2.png",
				comment : "Bien sans plus"
			};
		} else if (self.percentage() > 25) {
			return {
				score : self.score(),
				percentage : self.percentage(),
				smiley : "img/level3.png",
				comment : "Encore un petit effort"
			};
		} else {
			return {
				score : self.score(),
				percentage : self.percentage(),
				smiley : "img/level4.png",
				comment : "Ca craint..."
			};
		}

	})

	self.smiley = ko.computed(function() {
		if (self.percentage() > 75) {
			return "img/level1.png";
		} else if (self.percentage() > 50) {
			return "img/level2.png";
		} else if (self.percentage() > 25) {
			return "img/level3.png";
		} else {
			return "img/level4.png";
		}
	});

	Sammy(function() {
		this.get('choice', function() {
			self.view('choice');
		});
		this.get('results', function() {
			self.view('results');
		});
		this.get('#:index', function() {
			ind = parseInt(this.params.index);
			if (ind <= 0 || ind > self.number()) {
				location.hash = self.index().toString();
			} else {
				self.view('question');
				self.index(parseInt(this.params.index));
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			}
		});
	}).run();
}

ko.applyBindings(new QuizModel());

<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<div style="font-size: .8em">
			<p style="text-align: left">
				<xsl:value-of select="exo/enonce" />
			</p>
			<form style="text-align: left">
				<xsl:for-each select="exo/reponse">
					<p>
						<label>
							<input type="checkbox" />
							<xsl:value-of select="." />
						</label>
					</p>
				</xsl:for-each>
			</form>
		</div>
	</xsl:template>
</xsl:stylesheet>
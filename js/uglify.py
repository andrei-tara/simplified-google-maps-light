import sys
import os
import getopt
from subprocess import call


core =[	
	    'src/Prototype.js',
	    'src/EventDistpatcher.js',
	    'src/manager/BaseManager.js',
	    'src/manager/ConnectionManager.js',
	    'src/manager/MapManager.js',	    
	    'src/model/PlaceModel.js',	    
	    'src/model/MapModel.js',	    
	    'src/view/BaseView.js',
	    'src/view/MapView.js'
] 

backend =[	
	    'src/manager/NotificationsManager.js',	    
	    'src/model/BaseProvider.js',
	    'src/model/IconProviderModel.js',	    	    
	    'src/model/MapTypeProviderModel.js',
	    'src/view/fragment/AbstractAccordionView.js',	    
	    'src/view/fragment/PlacesView.js',
	    'src/view/fragment/SettingsView.js',
	    'src/view/adaptor/Select2Adaptor.js',	    
	    'src/view/EditableMapView.js',
	    'src/Bootstrap.js',
] 



def minmize(bundle, files):    
	with open(bundle+'.temp.js', 'w') as outfile:
		for fname in files:
			with open(fname.replace('{$bundle}',bundle)) as infile:
				for line in infile:
					outfile.write(line)
	
	call(["uglifyjs",bundle+'.temp.js',"-o", bundle+'.min.js'])
	os.remove(bundle+'.temp.js')

def main():
    minmize('cetabo-maps-core',core)
    minmize('cetabo-maps-backend',backend)

if __name__ == "__main__":
    main()
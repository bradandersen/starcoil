#!/usr/bin/perl
use GD::Simple;
use Data::Dumper;
$size=800;
$img=GD::Simple->new($size,$size);
#print Dumper(\@ARGV);
if(@ARGV){
 ($points,$includetext,$includelines)=@ARGV;
}
else{

 print "How many star points (1/2 points should be an odd number: 90, 30, [10])? ";
 chomp($points=<>);
 $points ||="10";
 print "Include text ([y]/n)? ";
 chomp($includetext=<>);
 $includetext ||="y";
 print "Include lines (y/[n])? ";
 chomp($includelines=<>);
 $includelines ||="n";
 #print "$includelines\n";
} 

$stepsize=360/$points;


print "Finding star patterns: ";


$dest=1;
$entry=2;
$stars={};
@destinations=(1);
for($i=2;$i<=($points/2)-0.5;$i++){
  do {
    $dest += $i;
    $dest > $points ? $dest-=$points : 1;
    push(@destinations,$dest);
#print "Dest: $dest > Points: $points\n";
  }until($dest==1);
  unshift(@destinations,$i);
#  print "Points,",$#destinations-1,",Steps,$i,",join(',',@destinations),"\n";
  $stars->{$entry}=[@destinations];
  print $entry++," ";
  @destinations=(1);
}
print "\n";

#print Dumper($stars);

foreach $star (sort {$a<=>$b} keys %$stars){

  print "Generating graph of each star point: ";

  $last=0;
  $point=1;
  $pointcoords={};
  for($i=0;$i<359.9;$i+=$stepsize){

    $img->moveTo($size/2,$size/2);
    $img->angle($i+270);
    $includelines=~/y/i ? $img->line(($size/2)-40) : $img->move(($size/2)-40);
    $pointcoords->{$point}=[$img->curPos()];
    $img->string("$point");
    $point++;
    print ".";
}
print "\n";
#print Dumper($pointcoords);

  print "Generating star graphics $star\n";
  $starpoints = $stars->{"$star"};
  $totalstarpoints=@$starpoints-2;
#print $totalstarpoints,"\n";
#print Dumper($starpoints);

  $starsteps = shift @$starpoints;
  $firstpoint=shift @$starpoints;

#print "$starsteps,$firstpoint\n";

  ($x,$y)=@{$pointcoords->{$firstpoint}};
#print "$x,$y\n";

  $img->moveTo($x,$y);

  foreach $item (@$starpoints){
#print "$item\n";
    ($x,$y)=@{$pointcoords->{$item}};
#print "$x,$y\n";
    $img->lineTo($x,$y);
  }


  if($includetext=~/y/i){
    $img->moveTo(20,20);
    $img->angle(0);
    $img->string("Winding pattern: 1,".join(",",@$starpoints));
    $img->moveTo(20,30);
    $img->string("Points on circle: $points");
    $img->moveTo(20,40);
    $img->string("Angle between points: $stepsize");
    $img->moveTo(20,50);
    $img->string("Step Size: $starsteps");
    $img->moveTo(20,60);
    $img->string("Tips: $totalstarpoints");
    $img->moveTo(20,70);
    $img->string("Iteration: $star");
  }


  my($filename)=sprintf("P%03d-S%03d-T%03d-I%03d.jpg",$points,$starsteps,$totalstarpoints,$star);
  print "$filename\n";
  open(IMG,">$filename") or die "Can't open image file:";
  binmode IMG;
  print IMG $img->jpeg;
  close(IMG);
  $img->clear;
}

print "\nDone!";

